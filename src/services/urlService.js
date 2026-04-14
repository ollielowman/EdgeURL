// handles db operations

const db = require('../config/db');
const crypto = require('crypto');

// insert URL → return ID
async function createUrl(originalUrl) {
  const [result] = await db.execute(
    'INSERT INTO urls (original_url) VALUES (?)',
    [originalUrl]
  );
  return result.insertId;
}

// add Base62 short code
async function addShortCode(id, shortCode) {
  await db.execute(
    'UPDATE urls SET short_code = ? WHERE id = ?',
    [shortCode, id]
  );
}

// get URL by short code (IMPORTANT: return id + url)
async function getUrlByCode(shortCode) {
  const [rows] = await db.execute(
    'SELECT id, original_url FROM urls WHERE short_code = ?',
    [shortCode]
  );

  return rows.length ? rows[0] : null;
}

// log click (click tracking)
async function logHit(urlId, ip, userAgent) {
  // hash IP for privacy
  const ipHash = crypto
    .createHash('sha256')
    .update(ip)
    .digest('hex');

  await db.execute(
    `INSERT INTO url_hits (url_id, ip_hash, user_agent)
     VALUES (?, ?, ?)`,
    [urlId, ipHash, userAgent]
  );
}

module.exports = {
  createUrl,
  addShortCode,
  getUrlByCode,
  logHit
};