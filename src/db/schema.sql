-- database schema for EdgeURL

CREATE DATABASE IF NOT EXISTS edgeurl;

USE edgeurl;

CREATE TABLE urls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(20) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE url_hits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url_id INT,
  hit_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_hash VARCHAR(255),
  user_agent TEXT,
  FOREIGN KEY (url_id) REFERENCES urls(id)
);