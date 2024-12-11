import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 定义每页显示的商品数量
const ITEMS_PER_PAGE = 12;

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const tagId = url.searchParams.get('tag_id');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || String(ITEMS_PER_PAGE));

    console.log("API received params:", { tagId, page, limit });

    // 计算偏移量
    const offset = (page - 1) * limit;

    // 构建基础查询
    let query;

    // 如果提供了tag_id，添加tag过滤
    if (tagId) {
      console.log("Querying with tag_id:", tagId);
      query = supabase
        .from('gift_items')
        .select(`
          gift_id,
          gift_name,
          gift_price,
          img_url,
          gift_item_tags!inner (tag_id)
        `)
        .eq('gift_item_tags.tag_id', tagId);
    } else {
      query = supabase
        .from('gift_items')
        .select(`
          gift_id,
          gift_name,
          gift_price,
          img_url
        `);
    }

    // 添加分页
    const { data: items, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('gift_id', { ascending: true });

    console.log("Database query result:", { items, error, count });

    if (error) {
      console.error("Database query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch items" },
        { status: 500 }
      );
    }

    // 清理带tag查询的数据
    const cleanedItems = tagId
      ? items?.map(item => ({
          gift_id: item.gift_id,
          gift_name: item.gift_name,
          gift_price: item.gift_price,
          img_url: item.img_url
        }))
      : items;

    const response = {
      items: cleanedItems || [],
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };

    console.log("Sending response:", response);

    return NextResponse.json(response);

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
