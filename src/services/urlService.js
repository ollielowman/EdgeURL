// handles db operations

const db = require('../config/db');

// validate URL
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

// find existing URL by original_url
async function getUrlByOriginal(originalUrl) {
  const [rows] = await db.execute(
    'SELECT id, original_url, short_code FROM urls WHERE original_url = ? LIMIT 1',
    [originalUrl]
  );

  return rows.length ? rows[0] : null;
}

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

// get URL by short code
async function getUrlByCode(shortCode) {
  const [rows] = await db.execute(
    'SELECT id, original_url FROM urls WHERE short_code = ?',
    [shortCode]
  );

  return rows.length ? rows[0] : null;
}

// fetch urls table
async function getAllUrls() {
  const [rows] = await db.execute(`
    SELECT id, original_url, short_code, created_at
    FROM urls
    ORDER BY created_at DESC
  `);
  return rows;
}

module.exports = {
  isValidUrl,
  getUrlByOriginal,
  createUrl,
  addShortCode,
  getUrlByCode,
  getAllUrls
};