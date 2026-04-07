// handles URL-related routes (homepage rendering and future URL shortening endpoints)

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;