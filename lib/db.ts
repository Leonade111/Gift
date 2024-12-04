// /db.ts

import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',  // 替换为你的 MySQL 用户名
  password: '123456',  // 替换为你的 MySQL 密码
  database: 'gift_item',  // 确保这里写上你的数据库名称
});

export default db;
