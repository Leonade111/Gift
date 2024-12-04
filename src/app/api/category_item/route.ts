// app/api/items/route.js

import mysql from 'mysql2/promise';

// 创建数据库连接池
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',  // 使用你的用户名
  password: '123456',  // 使用你的密码
  database: 'gift_item',  // 使用你的数据库名
});

export async function GET(request) {
  const url = new URL(request.url);
  const tagId = url.searchParams.get('tag_id'); // 获取URL中的tag_id参数

  try {
    // 查询物品信息，按tag_id筛选
    const query = tagId
      ? `SELECT g.gift_id, g.gift_name, g.gift_price, g.img_url FROM gift_items g
          JOIN gift_item_tags git ON g.gift_id = git.item_id
          WHERE git.tag_id = ?`
      : `SELECT gift_id, gift_name, gift_price, img_url FROM gift_items`; // 如果没有tag_id，返回所有物品

    const [items] = await db.execute(query, tagId ? [tagId] : []);
    return new Response(JSON.stringify(items), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Error fetching items' }), { status: 500 });
  }
}
