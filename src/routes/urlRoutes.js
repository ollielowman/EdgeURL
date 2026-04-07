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
router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl || !originalUrl.trim()) {
    return res.json({ error: 'Please enter a valid URL.' });
  }

  try {
    const shortCode = Math.random().toString(36).substring(2, 8);

    await urlService.createShortUrl(originalUrl, shortCode);

    const shortUrl = `http://localhost:8080/${shortCode}`;

    res.json({ shortUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const originalUrl = await urlService.getOriginalUrl(req.params.code);

    if (!originalUrl) {
      return res.status(404).send('Not found');
    }

    res.redirect(originalUrl);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;