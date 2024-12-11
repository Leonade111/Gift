// app/api/categories/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {  
  try {
    // 执行查询，获取 tags 表中的所有记录
    const { data: categories, error } = await supabase
      .from('tags')
      .select('tag_id, tag_name');

    if (error) throw error;

    return NextResponse.json(categories);  
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
