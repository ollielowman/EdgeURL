// build app, configures the express app with middleware, static files, views, logging, and routes

const express = require('express');
const path = require('path');
const urlRoutes = require('./routes/urlRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// parse form data and json request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// logs each request method, route, status code, and response time
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });

  next();
});

// serve css and other static frontend assets
app.use(express.static(path.join(__dirname, 'public')));

// mount url-related routes
app.use('/', urlRoutes);

module.exports = app;