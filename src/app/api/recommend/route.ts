import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    // 先检查数据库连接
    console.log('正在连接 Supabase...');

    // 获取标签数据
    const { data: tags, error } = await supabase
      .from('tags')  // 确保这是你的标签表名
      .select('tag_id, tag_name');

    // 添加详细的错误日志
    if (error) {
      console.error('Supabase 错误:', error);
      return NextResponse.json(
        { error: '获取标签数据失败', details: error },
        { status: 500 }
      );
    }

    if (!tags || tags.length === 0) {
      console.error('没有找到标签数据');
      return NextResponse.json(
        { error: '没有找到标签数据' },
        { status: 404 }
      );
    }

    // 构建标签信息字符串
    const tagInfo = tags.map(tag => `${tag.tag_id}: ${tag.tag_name}`).join('\n');

    // 构建系统消息
    const systemMessage = `你是一个礼物推荐助手。基于以下可用的礼物类别标签：
${tagInfo}

请分析用户的需求描述，返回最相关的2-3个标签ID。
只返回数字ID，用逗号分隔。例如：如果用户想要运动用品和电子产品，就返回对应的ID，如"4,2"。请确保返回至少2个标签，最多3个标签。`;

    const generatePromptOptions = {
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
                text: systemMessage,
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
        stream: false,
      }),
    };

    const generatePromptResponse = await fetch(
      "https://api.siliconflow.cn/v1/chat/completions",
      generatePromptOptions
    );

    if (!generatePromptResponse.ok) {
      const errorText = await generatePromptResponse.text();
      throw new Error(
        `生成提示API请求失败: ${generatePromptResponse.status} - ${errorText}`
      );
    }

    const generatePromptData = await generatePromptResponse.json();

    if (
      !generatePromptData.choices ||
      generatePromptData.choices.length === 0 ||
      !generatePromptData.choices[0].message ||
      !generatePromptData.choices[0].message.content
    ) {
      throw new Error("生成提示API返回的数据格式不正确");
    }

    const recommendedTags = generatePromptData.choices[0].message.content.trim();
    console.log("推荐的标签ID:", recommendedTags);

    // 验证返回的标签ID是否有效
    const returnedIds = recommendedTags.split(",").map((id: string) => parseInt(id.trim()));
    const validIds = returnedIds.filter((id: number) => tags.some((tag: { tag_id: number }) => tag.tag_id === id));

    return NextResponse.json({
      success: true,
      tagIds: validIds,
    });
  } catch (error: any) {
    console.error("失败:", error);
    return NextResponse.json(
      { error: error.message || "失败" },
      { status: 500 }
    );
  }
}
