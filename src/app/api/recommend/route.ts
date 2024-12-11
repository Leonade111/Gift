import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    // 从Supabase获取标签数据
    const { data: tags, error } = await supabase
      .from('tags')
      .select('tag_id, tag_name');

    if (error) throw new Error('获取标签数据失败');
    if (!tags || tags.length === 0) throw new Error('没有找到标签数据');

    // 构建标签信息字符串
    const tagsInfo = tags
      .map(tag => `${tag.tag_id}: ${tag.tag_name}`)
      .join('\n');

    // 构建系统消息
    const systemMessage = `你是一个礼物推荐助手。基于以下可用的礼物类别标签：
${tagsInfo}

请分析用户的需求描述，返回最相关的1-3个标签ID。
只返回数字ID，用逗号分隔。例如：如果用户想要运动用品和电子产品，就返回对应的ID，如"4,2"。`;

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
