// Vercel Serverless Function: /api/auth/verify-otp
const crypto = require("crypto");
const {
  AUTH_SECRET,
  tokenStore,
  otpStore,
  verifyHmacChallenge,
  verifyTimeOtp,
  isMasterCode,
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

    // 1. Check if user provided the Master PIN or Master Secret Key
    if (isMasterCode(cleanOtp)) {
      const token = "adm_" + crypto.randomBytes(24).toString("hex");
      tokenStore.set(token, Date.now() + 86400 * 1000);
      return res.status(200).json({
        token,
        username: normalized,
        expiresIn: 86400,
        message: "Admin authentication successful (Master PIN/Key).",
      });
    }

    // Must be 6 digits
    if (!cleanOtp.match(/^[0-9]{6}$/)) {
      return res.status(400).json({ error: "Verification code must be exactly 6 digits." });
    }

    // Rate limiting with safe IP resolution
    const ip = getClientIp(req);
    if (!checkRateLimit(`fail_${ip}`, 25, 15)) {
      return res.status(429).json({
        error: "Too many failed attempts. IP temporarily locked. Please try again in 15 minutes.",
      });
    }

    let isValid = false;

    // 2. Validate via Time-based OTP (Deterministic window - survives across ALL serverless containers & devices!)
    if (verifyTimeOtp(normalized, cleanOtp)) {
      isValid = true;
    }

    // 3. Validate via stateless cryptographic HMAC challenge if provided
    if (!isValid && challengeToken && typeof challengeToken === "string") {
      isValid = verifyHmacChallenge(normalized, cleanOtp, challengeToken);
    }

    // 4. Validate via cookie if challengeToken wasn't passed in body
    if (!isValid && req.headers && req.headers.cookie) {
      const cookieMatch = req.headers.cookie.match(/portfolio_otp_challenge=([^;]+)/);
      if (cookieMatch && cookieMatch[1]) {
        isValid = verifyHmacChallenge(normalized, cleanOtp, cookieMatch[1]);
      }
    }

    // 5. Fallback: Validate via in-memory store if warm instance
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
        error: "Invalid or expired verification code. Please click 'Send OTP' to request a new code or enter Master PIN.",
      });
    }

    // Success: Issue 24-hour admin session token
    const token = "adm_" + crypto.randomBytes(24).toString("hex");
    const expiresIn = 86400; // 24 hours
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
