// Shared in-memory store for serverless auth functions (warm instances)
const crypto = require("crypto");

// Active OTPs: normalizedEmail -> { hashedOtp, salt, expiry, attempts }
const otpStore = new Map();

// Active Tokens: token -> expiryTimestamp
const tokenStore = new Map();

// Rate limiter: key -> [timestamps]
const rateLimiter = new Map();

const AUTHORIZED_EMAILS = [
  (process.env.ADMIN_EMAIL || "ajaysapkale136@gmail.com").toLowerCase().trim(),
  "eazylogistics07@gmail.com",
  "ajaysapkale136@gmail.com"
];

function isAuthorizedAdmin(email) {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return AUTHORIZED_EMAILS.includes(normalized);
}

function hashOtp(otp, salt) {
  return crypto.createHash("sha256").update(salt + otp).digest("hex");
}

function checkRateLimit(key, maxLimit, windowMinutes) {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  let records = rateLimiter.get(key) || [];
  records = records.filter((ts) => now - ts < windowMs);
  if (records.length >= maxLimit) {
    rateLimiter.set(key, records);
    return false;
  }
  records.push(now);
  rateLimiter.set(key, records);
  return true;
}

module.exports = {
  otpStore,
  tokenStore,
  isAuthorizedAdmin,
  hashOtp,
  checkRateLimit,
};
