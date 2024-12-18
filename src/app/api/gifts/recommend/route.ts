import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { profileId } = await request.json();

    // 获取用户描述
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('long_description')
      .eq('id', profileId)
      .single();

    if (profileError) throw profileError;

    // 调用AI分析描述并生成标签
    const analysisResponse = await fetch(
      "https://api.siliconflow.cn/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SILICONFLOW_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-ai/DeepSeek-V2.5",
          messages: [
            {
              role: "system",
              content: [
                {
                  type: "text",
                  text: `基于用户描述，生成3-5个最相关的礼物标签。标签应该反映用户的兴趣、爱好和生活方式。
返回格式：["tag1", "tag2", "tag3"]

用户描述：
${profile.long_description}`
                }
              ]
            }
          ],
          stream: false,
        }),
      }
    );

    if (!analysisResponse.ok) {
      throw new Error(`AI API request failed: ${analysisResponse.status}`);
    }

    const analysisData = await analysisResponse.json();
    const tags = JSON.parse(analysisData.choices[0].message.content);

    // 获取包含这些标签的礼物
    const { data: gifts, error: giftsError } = await supabase
      .from('gifts')
      .select('*')
      .contains('tags', tags)
      .limit(9);

    if (giftsError) throw giftsError;

    return NextResponse.json({
      success: true,
      gifts,
      tags,
    });
  } catch (error) {
    console.error('Error getting gift recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get gift recommendations' },
      { status: 500 }
    );
  }
}
