// sets up and exports a mysql connection pool for the application to use

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'apple123', // database password
  database: process.env.DB_NAME || 'edgeurl',
  waitForConnections: true, // queue requests when no connections are available
  connectionLimit: 10 // max number of connections in the pool
});

module.exports = pool;