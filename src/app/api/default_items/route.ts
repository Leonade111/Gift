import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


const DEFAULT_ITEMS_LIMIT = 6; // 默认显示6个商品

export async function GET() {
  try {
    // 获取随机的商品
    const { data: items, error } = await supabase
      .from('gift_items')
      .select(`
        gift_id,
        gift_name,
        gift_price,
        img_url
      `)
      .limit(DEFAULT_ITEMS_LIMIT)
      .order('gift_id', { ascending: false }); // 获取最新添加的商品

    if (error) {
      console.error("Database query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch default items" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      items: items || []
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
