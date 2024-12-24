import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 使用服务端密钥初始化Supabase客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!, // 使用服务端密钥
  {
    auth: {
      persistSession: false // 禁用会话持久化，因为这是服务端
    }
  }
);

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
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // 确保必要字段存在
    if (!data.name || !data.age) {
      return NextResponse.json(
        { error: '缺少必要字段' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.id, // 如果前端提供了ID
          name: data.name,
          age: data.age,
          long_description: data.long_description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('创建用户档案失败:', error);
      return NextResponse.json(
        { error: '创建用户档案失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('处理创建用户档案请求时出错:', error);
    return NextResponse.json(
      { error: '创建用户档案失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('user_id');

    console.log('Attempting to delete profile with ID:', id);

    if (!id) {
      console.error('No user_id provided in request');
      return NextResponse.json(
        { error: '缺少用户ID参数' },
        { status: 400 }
      );
    }

    // 先查询所有匹配的记录
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id);

    console.log('Found profiles:', profiles);
    
    if (fetchError) {
      console.error('Error fetching profiles:', fetchError);
      return NextResponse.json(
        { error: '查询用户失败', details: fetchError.message },
        { status: 500 }
      );
    }

    if (!profiles || profiles.length === 0) {
      console.error('No profiles found with ID:', id);
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 执行删除操作
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting profile:', deleteError);
      return NextResponse.json(
        { error: '删除用户档案失败', details: deleteError.message },
        { status: 500 }
      );
    }

    console.log('Successfully deleted profile with ID:', id);
    return NextResponse.json({ 
      success: true,
      message: '用户档案已成功删除'
    });
  } catch (error) {
    console.error('Unexpected error while deleting profile:', error);
    return NextResponse.json(
      { 
        error: '删除用户档案请求处理失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}