import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Question {
  question: string;
  field: string;
  type: 'text' | 'number' | 'array';
}

interface APIResponse {
  success: boolean;
  question?: Question;
  error?: string;
  data?: {
    gifts: string[];
    message: string;
  };
}

const BASIC_QUESTIONS: Question[] = [
  {
    question: "What is the recipient's name?",
    field: "name",
    type: "text"
  },
  {
    question: "How old is he/she?",
    field: "age",
    type: "number"
  }
];

async function generateQuestion(previousAnswers: string[]): Promise<Question> {
  try {
    const apiKey = process.env.SILICONFLOW_API_KEY;
    if (!apiKey) {
      console.error('API密钥未设置');
      // 如果API密钥未设置，直接返回后备问题
      return getFallbackQuestion(previousAnswers);
    }

    // 过滤无效答案
    const validAnswers = previousAnswers.filter(answer =>
      answer && !['idk', 'no', 'not sure', 'maybe'].includes(answer.toLowerCase().trim())
    );

    const systemPrompt = `You are a gift advisor generating questions to understand gift preferences.
Rules:
1. Generate ONE short, clear question
2. If the previous answer was vague (like "IDK" or "no"), ask about a completely different topic
3. Focus on concrete details and specific preferences
4. Keep questions concise and focused
5. Questions should help understand gift preferences
6. Do not ask sensitive or personal questions
7. Use the third person or the recipient's name to ask questions
8. Return ONLY the question, no other text`;

    const userPrompt = `Previous detailed answers: "${validAnswers.join(', ')}"
Generate a new question about a different aspect of the person's interests or preferences.
Focus on topics not yet covered in the valid answers.`;

    const response = await fetch('https://api.siliconflow.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V2.5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data?.choices?.[0]?.message?.content) {
      throw new Error('无效的API响应');
    }

    const generatedQuestion = data.choices[0].message.content.trim();

    return {
      question: generatedQuestion,
      field: `q_${previousAnswers.length}`,
      type: "text"
    };
  } catch (error) {
    console.error('生成问题时出错:', error);
    return getFallbackQuestion(previousAnswers);
  }
}

// 分离后备问题逻辑为独立函数
function getFallbackQuestion(previousAnswers: string[]): Question {
  const fallbackQuestions = [
    "What kind of activities do they enjoy on weekends?",
    "What type of books or movies do they prefer?",
    "Do they have any specific hobbies or collections?",
    "What's their preferred style in fashion or home decor?",
    "Are they interested in any particular type of technology?",
    "What's their ideal way to spend free time?",
    "Do they have any favorite types of food or cuisine?",
    "What kind of music or art do they appreciate?",
  ];

  return {
    question: fallbackQuestions[previousAnswers.length % fallbackQuestions.length],
    field: `fallback_${previousAnswers.length}`,
    type: "text"
  };
}

async function generateLongDescription(answers: string[]): Promise<string> {
  try {
    const apiKey = process.env.SILICONFLOW_API_KEY;
    if (!apiKey) {
      return '无法生成描述：API密钥未设置';
    }

    // 确保answers不为空
    if (!answers || answers.length < 2) {
      return '无法生成描述：答案不足';
    }

    const otherAnswers = answers.slice(2); // 只使用问卷答案，不包括名字和年龄

    const systemPrompt = `You are an expert at analyzing people's preferences and interests.
Your task is to write a detailed description of a person based on their questionnaire answers.
The description should:
1. Be written in natural, flowing paragraphs
2. Include their personality traits, interests, and lifestyle
3. Highlight their preferences that are relevant for gift selection
4. Be personal and engaging, but professional
5. Be around 150-200 words long

Format the description as a proper narrative, not just a list of traits.`;

    const userPrompt = `Based on their questionnaire answers:
${otherAnswers.join('\n')}

Write a comprehensive description that captures who they are and what they might appreciate as gifts.`;

    const response = await fetch('https://api.siliconflow.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V2.5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim() || '无法生成描述';
  } catch (error) {
    console.error('生成描述时出错:', error);
    return '生成描述时发生错误';
  }
}

async function saveProfile(answers: string[], request: NextRequest): Promise<string[]> {
  try {
    if (!answers || answers.length < 2) {
      throw new Error('答案不足，无法创建档案');
    }

    const name = answers[0];
    const ageStr = answers[1];
    let age: number | null = null;
    
    if (ageStr && ageStr.trim()) {
      const parsedAge = parseInt(ageStr);
      if (!isNaN(parsedAge)) {
        age = parsedAge;
      }
    }

    // 生成用户描述
    const longDescription = await generateLongDescription(answers);
    if (longDescription.includes('无法生成描述') || longDescription.includes('生成描述时发生错误')) {
      throw new Error('无法生成用户描述');
    }

    // 创建用户档案
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert([
        {
          name,        // 存储名字
          age,  // 存储年龄
          long_description: longDescription,  // 存储AI生成的描述
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select('id, name, age, long_description')  // 明确指定要返回的字段
      .single();

    if (error) {
      console.error('保存用户档案失败:', error);
      throw new Error('保存用户档案失败');
    }

    if (!profile || typeof profile.id !== 'number') {
      console.error('保存成功但未返回有效的档案ID:', profile);
      throw new Error('未能获取到新建档案的ID');
    }

    console.log('新建档案:', profile);

    // 获取礼物推荐
    const recommendResponse = await fetch(new URL('/api/gifts/recommend', request.url).href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profileId: profile.id
      })
    });

    if (!recommendResponse.ok) {
      const errorText = await recommendResponse.text();
      console.error('获取推荐失败:', errorText);
      throw new Error('获取推荐失败: ' + errorText);
    }

    const recommendData = await recommendResponse.json();
    
    console.log('档案保存成功，推荐礼物:', recommendData.gifts);
    return recommendData.gifts; // 返回推荐的礼物
  } catch (error) {
    console.error('保存档案时出错:', error);
    throw error;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse>> {
  try {
    const { previousAnswers, questionIndex } = await request.json();

    // 如果 questionIndex 是 -1，这是最终提交
    if (questionIndex === -1) {
      const gifts = await saveProfile(previousAnswers, request);
      return NextResponse.json({
        success: true,
        data: {
          gifts: gifts,
          message: '档案保存成功'
        }
      });
    }

    // 如果是基础问题（名字和年龄）
    if (questionIndex < BASIC_QUESTIONS.length) {
      return NextResponse.json({
        success: true,
        question: BASIC_QUESTIONS[questionIndex]
      });
    }

    // 生成动态问题
    const question = await generateQuestion(previousAnswers);
    return NextResponse.json({
      success: true,
      question
    });

  } catch (error) {
    console.error('处理问题请求时出错:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '处理请求时出错'
      },
      { status: 500 }
    );
  }
}
