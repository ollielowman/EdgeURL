// create MySQL connection pool

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'apple123', 
  database: 'edgeurl',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;