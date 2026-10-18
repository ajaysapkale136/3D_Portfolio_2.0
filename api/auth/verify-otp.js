// Vercel Serverless Function: /api/auth/verify-otp
const crypto = require("crypto");
const {
  AUTH_SECRET,
  tokenStore,
  otpStore,
  isAuthorizedAdmin,
  verifyHmacChallenge,
  verifyTimeOtp,
  getClientIp,
  checkRateLimit,
} = require("./_store");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { email, otp, challengeToken } = req.body || {};
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and verification code are required." });
    }

    const normalized = email.toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    // Validate that the email is authorized for admin access
    if (!isAuthorizedAdmin(normalized)) {
      return res.status(401).json({ error: "The provided email is not authorized for administrator access." });
    }

    // Must be 6 digits
    if (!cleanOtp.match(/^[0-9]{6}$/)) {
      return res.status(400).json({ error: "Verification code must be exactly 6 digits." });
    }

    // Rate limiting with safe IP resolution
    const ip = getClientIp(req);
    if (!checkRateLimit(`fail_${ip}`, 15, 15)) {
      return res.status(429).json({
        error: "Too many failed attempts. IP temporarily locked. Please try again in 15 minutes.",
      });
    }

    let isValid = false;

    // 1. Validate via Time-based OTP window (deterministic across all instances)
    if (verifyTimeOtp(normalized, cleanOtp)) {
      isValid = true;
    }

    // 2. Validate via stateless cryptographic HMAC challenge if provided
    if (!isValid && challengeToken && typeof challengeToken === "string") {
      isValid = verifyHmacChallenge(normalized, cleanOtp, challengeToken);
    }

    // 3. Validate via cookie if challengeToken wasn't passed in body
    if (!isValid && req.headers && req.headers.cookie) {
      const cookieMatch = req.headers.cookie.match(/portfolio_otp_challenge=([^;]+)/);
      if (cookieMatch && cookieMatch[1]) {
        isValid = verifyHmacChallenge(normalized, cleanOtp, cookieMatch[1]);
      }
    }

    // 4. Fallback: Validate via in-memory store if warm instance
    if (!isValid) {
      const record = otpStore.get(normalized);
      if (record) {
        if (Date.now() <= record.expiry) {
          record.attempts += 1;
          if (record.attempts <= 5) {
            const computedHash = crypto.createHash("sha256").update(record.salt + cleanOtp).digest("hex");
            const expectedBuf = Buffer.from(record.hashedOtp, "hex");
            const actualBuf = Buffer.from(computedHash, "hex");
            if (expectedBuf.length === actualBuf.length && crypto.timingSafeEqual(expectedBuf, actualBuf)) {
              isValid = true;
              otpStore.delete(normalized);
            }
          }
        } else {
          otpStore.delete(normalized);
        }
      }
    }

    if (!isValid) {
      return res.status(401).json({
        error: "Invalid or expired verification code. Please request a new OTP code.",
      });
    }

    // Enforce short-lived sessions (2 hours = 7200 seconds)
    const expiresIn = 7200;
    const now = Math.floor(Date.now() / 1000);
    const exp = now + expiresIn;
    const jti = crypto.randomBytes(16).toString("hex");

    const payload = JSON.stringify({ sub: normalized, iat: now, exp, jti });
    const payloadB64 = Buffer.from(payload).toString("base64url");
    const signature = crypto.createHmac("sha256", AUTH_SECRET).update(`v1.${payloadB64}`).digest("hex");
    const token = `v1.${payloadB64}.${signature}`;

    tokenStore.set(token, Date.now() + expiresIn * 1000);

    return res.status(200).json({
      token,
      username: normalized,
      expiresIn,
      message: "Admin authentication successful.",
    });
  } catch (err) {
    console.error("verify-otp error:", err);
    return res.status(500).json({ error: "Verification failed. Please try again." });
  }
};
