// handles URL-related routes (homepage rendering and future URL shortening endpoints)

const express = require('express');
const router = express.Router();

const urlMap = new Map();

// renders the homepage
router.get('/', (req, res) => {
  res.render('index', {
    shortUrl: null,
    error: null,
    originalUrl: ''
  });
});

// handles form submission and creates a shortened URL
router.post('/shorten', (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl || !originalUrl.trim()) {
    return res.json({ error: 'Please enter a valid URL.' });
  }

  const shortCode = Math.random().toString(36).substring(2, 8);
  const shortUrl = `http://localhost:8080/${shortCode}`;

  res.json({ shortUrl });
});

module.exports = router;