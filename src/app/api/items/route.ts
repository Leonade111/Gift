import { NextResponse } from "next/server";
import mysql from "mysql2";

// 创建数据库连接
const db = mysql.createConnection({
  host: "localhost",  // 数据库地址
  user: "root",       // 数据库用户名
  password: "123456", // 数据库密码
  database: "gift_item", // 数据库名称
});

export async function GET() {
  // 返回数据库查询结果
  try {
    // 使用 Promise 包裹 MySQL 查询，并返回数据
    const results = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM gift_items", (err, results) => {
        if (err) {
          reject(err); // 如果有错误则拒绝 Promise
        }
        resolve(results); // 成功则返回查询结果
      });
    });

    // 将查询结果包装为 JSON 格式并返回
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json({ error: "Database query failed" }, { status: 500 });
  }
}
