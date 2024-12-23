import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 获取缓存的礼物推荐
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');

    if (!profileId) {
      return NextResponse.json(
        { error: 'Missing profileId' },
        { status: 400 }
      );
    }

    // 查询缓存
    const { data: cache, error } = await supabase
      .from('gift_recommendations_cache')
      .select('gifts, updated_at')
      .eq('profile_id', profileId)
      .single();

    if (error) {
      console.error('Error fetching gift cache:', error);
      return NextResponse.json(
        { error: 'Failed to fetch gift cache' },
        { status: 500 }
      );
    }

    if (!cache) {
      return NextResponse.json({ cached: false });
    }

    // 检查缓存是否过期（7天）
    const cacheAge = Date.now() - new Date(cache.updated_at).getTime();
    const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7天

    if (cacheAge > CACHE_EXPIRY) {
      return NextResponse.json({ cached: false });
    }

    return NextResponse.json({
      cached: true,
      gifts: cache.gifts,
    });
  } catch (error) {
    console.error('Error in gift cache API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 更新礼物推荐缓存
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileId, gifts } = body;

    if (!profileId || !gifts) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 更新或插入缓存
    const { data, error } = await supabase
      .from('gift_recommendations_cache')
      .upsert({
        profile_id: profileId,
        gifts,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating gift cache:', error);
      return NextResponse.json(
        { error: 'Failed to update gift cache' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      cache: data,
    });
  } catch (error) {
    console.error('Error in update gift cache API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
