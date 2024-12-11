import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
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
            role: "user",
            content: [
              {
                type: "text",
                text: `${prompt}`,
              },
            ],
          },
        ],
        stream: false, // 设置为 false 以获取完整响应
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

    const avatar_generation_prompt =
      generatePromptData.choices[0].message.content;
    console.log(avatar_generation_prompt);

    return NextResponse.json({
      success: true,
      prompt: avatar_generation_prompt,
    });
  } catch (error: any) {
    console.error("失败:", error);
    return NextResponse.json(
      { error: error.message || "失败" },
      { status: 500 }
    );
  }
}
