// app/api/categories/route.ts

import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    console.log("开始获取分类数据");

    // 执行查询，获取 tags 表中的所有记录
    const { data: categories, error, count } = await supabase
      .from('tags')
      .select('tag_id, tag_name', { count: 'exact' });

    // 错误处理
    if (error) {
      console.error("获取分类数据失败:", error);
      return NextResponse.json(
        {
          error: "获取分类数据失败",
          details: error.message
        },
        { status: 500 }
      );
    }

    // 检查数据是否为空
    if (!categories || categories.length === 0) {
      console.log("未找到分类数据");
      return NextResponse.json(
        {
          categories: [],
          total: 0
        }
      );
    }

    console.log(`成功获取 ${categories.length} 个分类`);

    // 返回成功响应
    return NextResponse.json({
      categories,
      total: count || categories.length
    });

  } catch (error) {
    console.error("意外错误:", error);
    return NextResponse.json(
      {
        error: "服务器内部错误",
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
