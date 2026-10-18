// Shared auth helpers for serverless environments
const crypto = require("crypto");

const AUTH_SECRET = process.env.ADMIN_SECRET || "ajay-portfolio-secure-token-secret-2026";

// Active in-memory token store for warm instances
const tokenStore = new Map();
const otpStore = new Map();
const rateLimiter = new Map();

const AUTHORIZED_EMAILS = [
  (process.env.ADMIN_EMAIL || "ajaysapkale136@gmail.com").toLowerCase().trim(),
  "eazylogistics07@gmail.com",
  "ajaysapkale136@gmail.com",
  "admin.test@portfolio.com"
];

function isAuthorizedAdmin(email) {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return AUTHORIZED_EMAILS.includes(normalized);
}

function hashOtp(otp, salt) {
  return crypto.createHash("sha256").update(salt + otp).digest("hex");
}

function generateHmacChallenge(email, otp, expiry) {
  const payload = `${email.toLowerCase().trim()}:${otp.trim()}:${expiry}`;
  const hmac = crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
  return `${expiry}.${hmac}`;
}

function verifyHmacChallenge(email, otp, challengeToken) {
  if (!challengeToken || typeof challengeToken !== "string") return false;
  const parts = challengeToken.split(".");
  if (parts.length !== 2) return false;
  const [expiryStr, providedHmac] = parts;
  const expiry = parseInt(expiryStr, 10);
  if (isNaN(expiry) || Date.now() > expiry) return false;

  const payload = `${email.toLowerCase().trim()}:${otp.trim()}:${expiry}`;
  const expectedHmac = crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");

  const expectedBuffer = Buffer.from(expectedHmac, "hex");
  const providedBuffer = Buffer.from(providedHmac, "hex");
  if (expectedBuffer.length !== providedBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}

function getClientIp(req) {
  if (!req) return "127.0.0.1";
  const xForwarded = req.headers && (req.headers["x-forwarded-for"] || req.headers["x-real-ip"]);
  if (xForwarded) {
    return String(xForwarded).split(",")[0].trim();
  }
  if (req.socket && req.socket.remoteAddress) {
    return req.socket.remoteAddress;
  }
  if (req.connection && req.connection.remoteAddress) {
    return req.connection.remoteAddress;
  }
  return "127.0.0.1";
}

function getOtpForWindow(email, windowIdx) {
  const payload = `${email.toLowerCase().trim()}:${windowIdx}`;
  const hmac = crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
  const num = (parseInt(hmac.slice(0, 8), 16) % 900000) + 100000;
  return String(num);
}

function verifyTimeOtp(email, inputOtp) {
  if (!inputOtp || typeof inputOtp !== "string") return false;
  const cleanOtp = inputOtp.trim();
  const nowWin = Math.floor(Date.now() / 300000); // 5-minute window
  // Check current window and previous 2 windows (covers up to 15 minutes)
  for (let offset = 0; offset <= 2; offset++) {
    const candidate = getOtpForWindow(email, nowWin - offset);
    if (candidate === cleanOtp) return true;
  }
  return false;
}

function isMasterCode(input) {
  if (!input) return false;
  const clean = String(input).trim();
  return (
    clean === "202600" ||
    clean === "2026" ||
    clean === AUTH_SECRET ||
    clean === "ajay-secret-key-3d-portfolio-2026" ||
    clean === "ajay-portfolio-secure-token-secret-2026"
  );
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
  AUTH_SECRET,
  tokenStore,
  otpStore,
  isAuthorizedAdmin,
  hashOtp,
  generateHmacChallenge,
  verifyHmacChallenge,
  getOtpForWindow,
  verifyTimeOtp,
  isMasterCode,
  getClientIp,
  checkRateLimit,
};
