// in-memory rate limiting middleware to prevent abuse of endpoints

const ipStore = new Map();

function createRateLimiter({
  windowMs = 60 * 1000,
  maxRequests = 15,
  message = 'Too many requests, please try again later.'
} = {}) {
  return (req, res, next) => {
    // get client ip (supports proxies via x-forwarded-for)
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'unknown';

    const now = Date.now();
    const entry = ipStore.get(ip);

    // first request from this ip
    if (!entry) {
      ipStore.set(ip, { count: 1, windowStart: now });
      return next();
    }

    // reset window if time has passed
    if (now - entry.windowStart >= windowMs) {
      entry.count = 1;
      entry.windowStart = now;
      ipStore.set(ip, entry);
      return next();
    }

    // block request if limit exceeded
    if (entry.count >= maxRequests) {
      return res.status(429).json({
        error: message,
        retryAfterSeconds: Math.ceil((windowMs - (now - entry.windowStart)) / 1000)
      });
    }

    // increment request count
    entry.count += 1;
    next();
  };
}

// cleanup: remove stale ip entries every 5 minutes to prevent memory growth
setInterval(() => {
  const now = Date.now();

  for (const [ip, entry] of ipStore.entries()) {
    if (now - entry.windowStart >= 5 * 60 * 1000) {
      ipStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

module.exports = createRateLimiter;