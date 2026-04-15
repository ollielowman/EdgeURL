-- database schema for EdgeURL

CREATE DATABASE IF NOT EXISTS edgeurl;

USE edgeurl;

CREATE TABLE urls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(20) NULL UNIQUE,
  click_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
