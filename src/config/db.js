// sets up and exports a mysql connection pool for the application to use

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'apple123', // database password
  database: 'edgeurl',
  waitForConnections: true, // queue requests when no connections are available
  connectionLimit: 10 // max number of connections in the pool
});

module.exports = pool;