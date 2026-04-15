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

// normalize URL so equivalent links match
function normalizeUrl(url) {
  const parsed = new URL(url.trim());

  parsed.protocol = parsed.protocol.toLowerCase();
  parsed.hostname = parsed.hostname.toLowerCase();

  // remove default ports
  if (
    (parsed.protocol === 'http:' && parsed.port === '80') ||
    (parsed.protocol === 'https:' && parsed.port === '443')
  ) {
    parsed.port = '';
  }

  // remove trailing slash from non-root paths
  if (parsed.pathname.length > 1 && parsed.pathname.endsWith('/')) {
    parsed.pathname = parsed.pathname.slice(0, -1);
  }

  // remove root slash
  if (parsed.pathname === '/') {
    parsed.pathname = '';
  }

  return parsed.toString();
}
async function incrementClickCountByCode(shortCode) {
  await db.execute(
    'UPDATE urls SET click_count = click_count + 1 WHERE short_code = ?',
    [shortCode]
  );
}

// find existing URL by original_url
async function getUrlByOriginal(originalUrl) {
  const [rows] = await db.execute(
    'SELECT id, original_url, short_code, click_count FROM urls WHERE original_url = ? LIMIT 1',
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

// increment click count
async function incrementClickCount(id) {
  await db.execute(
    'UPDATE urls SET click_count = click_count + 1 WHERE id = ?',
    [id]
  );
}

// get URL by short code
async function getUrlByCode(shortCode) {
  const [rows] = await db.execute(
    'SELECT id, original_url, click_count FROM urls WHERE short_code = ?',
    [shortCode]
  );

  return rows.length ? rows[0] : null;
}

// fetch urls table
async function getAllUrls() {
  const [rows] = await db.execute(`
    SELECT id, original_url, short_code, click_count, created_at
    FROM urls
    ORDER BY created_at DESC
  `);
  return rows;
}

// url encoding
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function encodeBase62(num) {
  let result = '';
  while (num > 0) {
    result = BASE62[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result || '0';
}

async function resetUrls() {
  await db.execute('TRUNCATE TABLE urls');
}

module.exports = {
  isValidUrl,
  getUrlByOriginal,
  createUrl,
  addShortCode,
  incrementClickCount,
  incrementClickCountByCode,
  getUrlByCode,
  getAllUrls,
  encodeBase62,
  normalizeUrl,
  resetUrls
};