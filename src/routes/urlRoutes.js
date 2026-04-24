// defines edgeurl routes for rendering pages, shortening urls, redirects, caching, and logs

const express = require('express');
const router = express.Router();
const urlService = require('../services/urlService');
const createRateLimiter = require('../middleware/rateLimiter');
const { redisClient } = require('../config/redis');

const shortenLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 15,
  message: 'Too many URL shortening requests. Please try again later.'
});

// renders the homepage with empty state for url input and result display
router.get('/', (req, res) => {
  res.render('index', {
    shortUrl: null,
    error: null,
    originalUrl: ''
  });
});

// displays all stored urls and their metadata on the logs page
router.get('/logs', async (req, res) => {
  try {
    const urls = await urlService.getAllUrls();

    res.render('logs', { urls });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to load logs page');
  }
});

// handles url shortening requests with validation, reuse logic, and short code generation
router.post('/shorten', shortenLimiter, async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl || !originalUrl.trim()) {
    return res.status(400).json({
      error: 'Please enter a URL.'
    });
  }

  const rawUrl = originalUrl.trim();

  if (!urlService.isValidUrl(rawUrl)) {
    return res.status(400).json({
      error: 'Please enter a valid URL (include http:// or https://).'
    });
  }

  const normalizedUrl = urlService.normalizeUrl(rawUrl);

  try {
    // reuse existing short code if the url has already been shortened
    const existingUrl = await urlService.getUrlByOriginal(normalizedUrl);

    if (existingUrl) {
      return res.status(200).json({
        shortUrl: `http://localhost:8080/${existingUrl.short_code}`,
        reused: true
      });
    }

    // create database record first, then convert its id into a short code
    const id = await urlService.createUrl(normalizedUrl);
    const shortCode = urlService.encodeBase62(id);

    await urlService.addShortCode(id, shortCode);

    return res.status(201).json({
      shortUrl: `http://localhost:8080/${shortCode}`,
      reused: false
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: 'DB error'
    });
  }
});

// redirects short code to original url, using redis cache for faster lookups
router.get('/:code', async (req, res) => {
  try {
    const shortCode = req.params.code;
    const cacheKey = `short:${shortCode}`;

    // check redis before querying mysql
    const cachedUrl = await redisClient.get(cacheKey);

    if (cachedUrl) {
      console.log(`Cache hit for ${shortCode}`);
      await urlService.incrementClickCountByCode(shortCode);

      return res.redirect(cachedUrl);
    }

    console.log(`Cache miss for ${shortCode}`);

    const url = await urlService.getUrlByCode(shortCode);

    if (!url) {
      return res.status(404).send('Not found');
    }

    // cache original url for faster future redirects
    await redisClient.set(cacheKey, url.original_url, {
      EX: 3600
    });

    await urlService.incrementClickCount(url.id);

    return res.redirect(url.original_url);
  } catch (err) {
    console.error(err);

    return res.status(500).send('Server error');
  }
});

// resets all stored url data and redirects back to logs page
router.post('/reset', async (req, res) => {
  try {
    await urlService.resetUrls();

    res.redirect('/logs');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to reset data');
  }
});

module.exports = router;