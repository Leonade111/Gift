import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 定义接口类型
interface FormattedGiftItem {
  gift_id: number;
  gift_name: string;
  gift_price: number | null;
  img_url: string | null;
  created_at: string;
  tags: string[];
}

interface ApiResponse {
  success: boolean;
  gifts: FormattedGiftItem[];
  tags: string[];
  strategy: string;
  error?: string;
}

// 创建 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 辅助函数：获取可用标签
async function getAvailableTags(): Promise<string[]> {
  const { data: tags, error } = await supabase
    .from('tags')
    .select('tag_name');

  if (error) {
    console.error('获取标签列表失败:', error);
    throw error;
  }

  return tags.map(tag => tag.tag_name);
}

// 辅助函数：通过AI生成标签
async function generateTagsWithAI(prompt: string, availableTags: string[]): Promise<string[]> {
  const response = await fetch(
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
                text: `从以下标签中选择2-3个最相关的标签：${availableTags.join(', ')}

基于用户描述，选择最合适的标签。
返回格式：["tag1", "tag2"]

用户描述：
${prompt}`
              }
            ]
          }
        ],
        stream: false,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`AI API request failed: ${response.status}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

// 辅助函数：获取礼物列表
async function getGiftsByTags(selectedTags: string[]): Promise<any[]> {
  console.log('查询标签:', selectedTags);
  
  // 先获取带有这些标签的gift_item_tags记录
  const { data: taggedItems, error: tagError } = await supabase
    .from('gift_item_tags')
    .select(`
      item_id,
      tags!inner (
        tag_name
      )
    `)
    .in('tags.tag_name', selectedTags);

  if (tagError) {
    console.error('获取标签关联失败:', tagError);
    throw tagError;
  }

  console.log('找到的标签关联:', taggedItems);

  // 获取对应的礼物详情
  if (taggedItems && taggedItems.length > 0) {
    const itemIds = [...new Set(taggedItems.map(item => item.item_id))];
    
    const { data: gifts, error: giftError } = await supabase
      .from('gift_items')
      .select('*')
      .in('gift_id', itemIds)
      .order('gift_price')
      .limit(9);

    if (giftError) {
      console.error('获取礼物失败:', giftError);
      throw giftError;
    }

    console.log('找到的礼物:', gifts);
    return gifts || [];
  }

  return [];
}

// 辅助函数：格式化礼物数据
function formatGifts(gifts: any[]): FormattedGiftItem[] {
  return gifts.map(gift => {
    // 确保每个字段都有默认值
    const formattedGift = {
      gift_id: gift.gift_id || '',
      gift_name: gift.gift_name || '',
      gift_price: gift.gift_price || 0,
      img_url: gift.img_url || '',
      created_at: gift.created_at || new Date().toISOString(),
      tags: []
    };

    // 处理标签数据
    if (gift.gift_item_tags && Array.isArray(gift.gift_item_tags)) {
      formattedGift.tags = gift.gift_item_tags
        .map((tagItem: any) => tagItem.tags?.tag_name)
        .filter((tagName: string | undefined): tagName is string => !!tagName);
    }

    return formattedGift;
  });
}

// 生成送礼策略
async function generateGiftStrategy(prompt: string): Promise<string> {
  const response = await fetch(
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
                text: `请根据用户描述的送礼场景，生成一段不超过150字的实用建议。建议应该包含：
1. 具体的礼物选择思路（从收礼人的兴趣、需求或场合出发）
2. 实际的价格区间建议
3. 送礼时的小贴士（如包装、送礼时机或表达方式）

保持建议具体且实用，避免空泛的表述。

用户描述：${prompt}`
              }
            ]
          }
        ],
        stream: false,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`AI API request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// 主要的API处理函数
export async function POST(request: NextRequest) {
  try {
    // 1. 验证请求数据
    const body = await request.json();
    if (!body.prompt) {
      return NextResponse.json<ApiResponse>(
        { 
          success: false, 
          gifts: [],
          tags: [],
          strategy: '',
          error: 'Missing prompt parameter'
        },
        { status: 400 }
      );
    }

    // 2. 获取可用标签
    const availableTags = await getAvailableTags();
    
    // 3. 使用AI生成标签
    const selectedTags = await generateTagsWithAI(body.prompt, availableTags);
    console.log('选中的标签:', selectedTags);

    // 4. 获取礼物列表
    const gifts = await getGiftsByTags(selectedTags);
    
    // 5. 生成送礼策略
    const strategy = await generateGiftStrategy(body.prompt);
    
    // 6. 格式化结果
    const formattedGifts = formatGifts(gifts);

    // 7. 返回结果
    return NextResponse.json<ApiResponse>({
      success: true,
      gifts: formattedGifts,
      tags: selectedTags,
      strategy: strategy
    });

  } catch (error) {
    console.error('Error in gift recommendations:', error);
    return NextResponse.json<ApiResponse>(
      { 
        success: false,
        gifts: [],
        tags: [],
        strategy: '',
        error: 'Failed to get gift recommendations'
      },
      { status: 500 }
    );
  }
}
