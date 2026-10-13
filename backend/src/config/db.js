const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'agrotrade_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true,
});

// Test database connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL database connection failed:', err.message);
  } else {
    console.log('MySQL Database connected successfully to', process.env.DB_NAME || 'agrotrade_db');
    connection.release();
  }
});

module.exports = pool;
