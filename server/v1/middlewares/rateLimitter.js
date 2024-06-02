const rateLimit = require("express-rate-limit")

exports.rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "You have exceeded your 10 requests per minute limit.",
  headers: true,
})
