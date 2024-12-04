// app/api/categories/route.js

import mysql from 'mysql2/promise';
import { NextRequest } from 'next/server'; // 导入 NextRequest 类型

// 创建数据库连接池
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',  // 替换为你的 MySQL 用户名
  password: '123456',  // 替换为你的 MySQL 密码
  database: 'gift_item',  // 替换为你的数据库名
});

export async function GET(request: NextRequest) {  // 为 request 添加类型
  try {
    // 执行查询，获取 tags 表中的所有记录
    const [categories] = await db.execute('SELECT tag_id, tag_name FROM tags');
    return new Response(JSON.stringify(categories), { status: 200 });  // 返回类别列表
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Error fetching categories' }), { status: 500 });
  }
}
