import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface GiftItem {
  gift_id: number;
  gift_name: string;
  gift_price: number;
  img_url: string;
  created_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: '缺少用户ID参数' },
        { status: 400 }
      );
    }

    // 获取用户档案
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('long_description')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('获取用户档案失败:', profileError);
      return NextResponse.json(
        { error: '获取用户档案失败' },
        { status: 500 }
      );
    }

    // 根据用户描述获取推荐礼物
    // 这里可以添加更复杂的推荐逻辑
    const { data: gifts, error: giftsError } = await supabase
      .from('gift_items')
      .select('*')
      .limit(6); // 限制返回6个礼物

    if (giftsError) {
      console.error('获取礼物列表失败:', giftsError);
      return NextResponse.json(
        { error: '获取礼物列表失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      gifts: gifts.map(gift => ({
        id: gift.gift_id,
        name: gift.gift_name,
        price: gift.gift_price,
        image_url: gift.img_url
      }))
    });

  } catch (error) {
    console.error('处理获取礼物请求时出错:', error);
    return NextResponse.json(
      { error: '获取礼物请求处理失败' },
      { status: 500 }
    );
  }
}