import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 定义类型
type GiftItem = {
  gift_id: number;
  gift_name: string;
  gift_price: number | null;
  img_url: string | null;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('收到推荐请求:', body);

    let userDescription: string;

    if (body.profileId) {
      // 通过profileId获取描述
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('long_description')
        .eq('id', typeof body.profileId === 'string' ? parseInt(body.profileId) : body.profileId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return NextResponse.json(
          { error: 'Failed to fetch profile' },
          { status: 500 }
        );
      }

      if (!profile || !profile.long_description) {
        console.error('Profile not found or missing description:', { profileId: body.profileId, profile });
        return NextResponse.json(
          { error: 'Profile not found or missing description' },
          { status: 404 }
        );
      }

      userDescription = profile.long_description;
    } else if (body.longDescription) {
      // 直接使用提供的描述
      userDescription = body.longDescription;
    } else {
      console.error('Missing both profileId and longDescription:', body);
      return NextResponse.json(
        { error: 'Either profileId or longDescription is required' },
        { status: 400 }
      );
    }

    // 首先获取所有可用的标签
    const { data: availableTags, error: tagsError } = await supabase
      .from('tags')
      .select('tag_name');

    if (tagsError) {
      console.error('获取标签列表失败:', tagsError);
      throw tagsError;
    }

    const tagList = availableTags.map(tag => tag.tag_name).join(', ');

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
                  text: `从以下标签中选择2-3个最相关的标签：${tagList}

基于用户描述，选择最合适的标签。
返回格式：["tag1", "tag2"]

用户描述：
${userDescription}`
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
    const selectedTags = JSON.parse(analysisData.choices[0].message.content);
    console.log('选中的标签:', selectedTags);

    // 获取标签ID
    const { data: tagIds, error: tagError } = await supabase
      .from('tags')
      .select('tag_id')
      .in('tag_name', selectedTags);

    if (tagError) {
      console.error('获取标签ID失败:', tagError);
      throw tagError;
    }

    // 首先获取带有这些标签的礼物ID
    const { data: giftTagResults, error: giftTagError } = await supabase
      .from('gift_item_tags')
      .select('item_id')
      .in('tag_id', tagIds.map(t => t.tag_id));

    if (giftTagError) {
      console.error('获取礼物标签关联失败:', giftTagError);
      throw giftTagError;
    }

    if (!giftTagResults || giftTagResults.length === 0) {
      return NextResponse.json({
        success: true,
        gifts: [],
        tags: selectedTags
      });
    }

    // 然后获取这些礼物的详细信息
    const { data: giftResults, error: giftsError } = await supabase
      .from('gift_items')
      .select('*')
      .in('gift_id', giftTagResults.map(g => g.item_id))
      .limit(9);

    if (giftsError) {
      console.error('获取礼物失败:', giftsError);
      throw giftsError;
    }

    if (!giftResults) {
      return NextResponse.json({
        success: true,
        gifts: [],
        tags: selectedTags
      });
    }

    // 按价格排序
    const sortedGifts = [...giftResults].sort((a: any, b: any) => {
      const priceA = a.gift_price || 0;
      const priceB = b.gift_price || 0;
      return priceA - priceB;
    });

    return NextResponse.json({
      success: true,
      gifts: sortedGifts,
      tags: selectedTags
    });
  } catch (error) {
    console.error('Error getting gift recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get gift recommendations' },
      { status: 500 }
    );
  }
}
