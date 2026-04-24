-- defines the database and urls table structure for the edgeurl application

CREATE DATABASE IF NOT EXISTS edgeurl;

USE edgeurl;

CREATE TABLE urls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  original_url TEXT NOT NULL, -- full original url entered by user
  short_code VARCHAR(20) NULL UNIQUE, -- generated short code (unique identifier)
  click_count INT NOT NULL DEFAULT 0, -- tracks how many times the link is used
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- record creation time
);