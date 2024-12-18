import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

    const systemPrompt = `You are a gift advisor analyzing a person's preferences.
Generate a detailed description of the person based on their answers to questions.
Focus on their interests, preferences, and potential gift ideas.
Keep the description concise but informative.`;

    const userPrompt = `Based on these answers: "${answers.slice(2).join(', ')}"
Generate a description of this person's interests and preferences.`;

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
    return data.choices[0].message.content.trim() || '无法生成描述';
  } catch (error) {
    console.error('生成描述时出错:', error);
    return '生成描述时发生错误';
  }
}

async function saveProfile(answers: string[]): Promise<void> {
  try {
    if (!answers || answers.length < 2) {
      throw new Error('答案不足，无法创建档案');
    }

    const name = answers[0]?.trim() || 'Unknown';
    const age = parseInt(answers[1]) || 0;
    const longDescription = await generateLongDescription(answers);

    const { error } = await supabase
      .from('profiles')
      .insert([
        {
          name,
          age,
          long_description: longDescription,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    console.log('档案保存成功');
  } catch (error) {
    console.error('保存档案时出错:', error);
    throw error;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse>> {
  try {
    const body = await request.json();
    const { previousAnswers = [], questionIndex = 0 } = body;

    // 验证输入
    if (!Array.isArray(previousAnswers)) {
      console.error('无效的答案格式');
      return NextResponse.json({
        success: false,
        error: '无效的答案格式'
      });
    }

    // 检查是否完成所有问题
    if (questionIndex >= BASIC_QUESTIONS.length + 8) {
      await saveProfile(previousAnswers);
      return NextResponse.json({
        success: true,
        question: undefined
      });
    }

    // 获取下一个问题
    let question: Question;
    if (questionIndex < BASIC_QUESTIONS.length) {
      question = BASIC_QUESTIONS[questionIndex];
    } else {
      question = await generateQuestion(previousAnswers);
    }

    return NextResponse.json({
      success: true,
      question
    });

  } catch (error) {
    console.error('处理问题请求时出错:', error);
    return NextResponse.json({
      success: false,
      error: '处理请求失败'
    }, { status: 500 });
  }
}
