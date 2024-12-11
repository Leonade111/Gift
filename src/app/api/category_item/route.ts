import { NextRequest } from 'next/server';  // 确保导入 NextRequest
import mysql from 'mysql2/promise';

// 创建数据库连接池
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',  // 替换为你的数据库用户名
  password: '123456',  // 替换为你的数据库密码
  database: 'gift_item',  // 确保你的数据库名称是 gift_item
});

export async function GET(request: NextRequest) {
  const url = new URL(request.url); // 获取请求的 URL
  const tagId = url.searchParams.get('tag_id'); // 获取 URL 中的 tag_id 参数

  try {
    // 根据是否传入 tag_id 来决定查询的 SQL 语句
    const query = tagId
      ? `SELECT g.gift_id, g.gift_name, g.gift_price, g.img_url 
         FROM gift_items g
         JOIN gift_item_tags git ON g.gift_id = git.item_id
         WHERE git.tag_id = ?`
      : `SELECT gift_id, gift_name, gift_price, img_url FROM gift_items`;  // 如果没有 tag_id，返回所有物品

    const [items] = await db.execute(query, tagId ? [tagId] : []);
    return new Response(JSON.stringify(items), { status: 200 });
  } catch (error) {
    console.error('Error fetching items:', error);
    return new Response(JSON.stringify({ message: 'Error fetching items' }), { status: 500 });
  }
}
