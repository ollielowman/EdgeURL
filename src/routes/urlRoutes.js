// handles URL-related routes (homepage rendering and future URL shortening endpoints)

const express = require('express');
const router = express.Router();
const urlService = require('../services/urlService');

// renders the homepage
router.get('/', (req, res) => {
  res.render('index', {
    shortUrl: null,
    error: null,
    originalUrl: ''
  });
});

// handles form submission and creates a shortened URL
const { encodeBase62 } = require('../utils/base62');
router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl || !originalUrl.trim()) {
    return res.json({ error: 'Please enter a valid URL.' });
  }

  try {
    // insert URL first (returns ID)
    const id = await urlService.createUrl(originalUrl);

    // encode ID → Base62
    const shortCode = encodeBase62(id);

    // update DB with shortCode
    await urlService.addShortCode(id, shortCode);

    const shortUrl = `http://localhost:8080/${shortCode}`;

    res.json({ shortUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const url = await urlService.getUrlByCode(req.params.code);

    if (!url) {
      return res.status(404).send('Not found');
    }

    // log the click
    await urlService.logHit(
      url.id,
      req.ip,
      req.headers['user-agent']
    );

    res.redirect(url.original_url);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;