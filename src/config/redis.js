// initializes and manages the redis client connection for caching

const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379' // fallback to local redis instance
});

// log any redis client errors
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// connects to redis if not already connected
async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('Connected to Redis');
  }
}

module.exports = {
  redisClient,
  connectRedis
};