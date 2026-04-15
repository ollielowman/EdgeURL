const express = require('express');
const router = express.Router();
const urlService = require('../services/urlService');
const { encodeBase62 } = require('../utils/base62');
const createRateLimiter = require('../middleware/rateLimiter');
const { redisClient } = require('../config/redis');

const shortenLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 15,
  message: 'Too many URL shortening requests. Please try again later.'
});

router.get('/', (req, res) => {
  res.render('index', {
    shortUrl: null,
    error: null,
    originalUrl: ''
  });
});

router.get('/logs', async (req, res) => {
  try {
    const urls = await urlService.getAllUrls();
    res.render('logs', { urls });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to load logs page');
  }
});

router.post('/shorten', shortenLimiter, async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl || !originalUrl.trim()) {
    return res.status(400).json({
      error: 'Please enter a URL.'
    });
  }

  const cleanUrl = originalUrl.trim();

  if (!urlService.isValidUrl(cleanUrl)) {
    return res.status(400).json({
      error: 'Please enter a valid URL (include http:// or https://).'
    });
  }

  try {
    const existingUrl = await urlService.getUrlByOriginal(cleanUrl);

    if (existingUrl) {
      return res.status(200).json({
        shortUrl: `http://localhost:8080/${existingUrl.short_code}`,
        reused: true
      });
    }

    const id = await urlService.createUrl(cleanUrl);
    const shortCode = encodeBase62(id);

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

router.get('/:code', async (req, res) => {
  try {
    const shortCode = req.params.code;
    const cacheKey = `short:${shortCode}`;

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

module.exports = router;