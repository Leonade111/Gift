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
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM gift_items", (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return reject(new NextResponse("Database query failed", { status: 500 }));
      }
      resolve(new NextResponse(JSON.stringify(results), { status: 200 }));
    });
  });
}
