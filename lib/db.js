import mysql from 'mysql2';

// 设置 MySQL 数据库连接池
const pool = mysql.createPool({
  host: 'localhost',   // MySQL 服务器地址
  user: 'root',        // MySQL 用户名
  password: '123456',  // 你的 MySQL 密码
  database: 'gift_item',  // 使用的数据库名称
});

// 通过 pool.query 封装成 Promise 方式
export const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (err, results) => {
      if (err) {
        return reject(err);  // 返回错误
      }
      resolve(results);  // 返回查询结果
    });
  });
};
