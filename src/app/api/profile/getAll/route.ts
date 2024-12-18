import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // 从数据库中获取所有profiles
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) throw error;

    return NextResponse.json({
      success: true,
      profiles,
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch profiles', details: errorMessage },
      { status: 500 }
    );
  }
}
