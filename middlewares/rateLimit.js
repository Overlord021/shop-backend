// ==================== Rate Limit Middleware ====================

const store = new Map();

// Periodic cleanup of expired entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of store.entries()) {
    if (now > record.resetTime) {
      store.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export default function rateLimit(windowMs = 60 * 1000, maxRequests = 100) {
  return (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    let record = store.get(ip);

    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      store.set(ip, record);
    } else {
      record.count++;
      if (record.count > maxRequests) {
        return res.status(429).json({ message: "درخواست‌های بیش از حد مجاز. لطفاً کمی صبر کنید." });
      }
    }
    next();
  };
}
