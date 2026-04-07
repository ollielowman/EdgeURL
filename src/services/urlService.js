// handles DB operations for URLs

const pool = require('../config/db');

async function createShortUrl(originalUrl, shortCode) {
  const sql = 'INSERT INTO urls (original_url, short_code) VALUES (?, ?)';
  await pool.execute(sql, [originalUrl, shortCode]);
}

async function getOriginalUrl(shortCode) {
  const sql = 'SELECT original_url FROM urls WHERE short_code = ?';
  const [rows] = await pool.execute(sql, [shortCode]);

  if (rows.length === 0) return null;

  return rows[0].original_url;
}

module.exports = {
  createShortUrl,
  getOriginalUrl
};