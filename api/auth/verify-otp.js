// Vercel Serverless Function: /api/auth/verify-otp
const crypto = require("crypto");
const { otpStore, tokenStore, hashOtp, checkRateLimit } = require("./_store");

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
    const { email, otp } = req.body || {};
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and verification code are required." });
    }

    const normalized = email.toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    if (!cleanOtp.match(/^[0-9]{6}$/)) {
      return res.status(400).json({ error: "Verification code must be exactly 6 digits." });
    }

    // Rate limiting failed attempts
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "ip";
    if (!checkRateLimit(`fail_${ip}`, 10, 15)) {
      return res.status(429).json({
        error: "Too many failed attempts. IP temporarily locked. Please try again in 15 minutes.",
      });
    }

    const record = otpStore.get(normalized);
    if (!record) {
      return res.status(401).json({
        error: "No active verification code found for this email. Please request a new code.",
      });
    }

    // Check expiry
    if (Date.now() > record.expiry) {
      otpStore.delete(normalized);
      return res.status(401).json({
        error: "The verification code has expired. Please request a new code.",
      });
    }

    // Check attempts
    record.attempts += 1;
    if (record.attempts > 5) {
      otpStore.delete(normalized);
      return res.status(401).json({
        error: "Maximum verification attempts exceeded. Please request a new code.",
      });
    }

    // Verify hash
    const computedHash = hashOtp(cleanOtp, record.salt);
    const expectedBuffer = Buffer.from(record.hashedOtp, "hex");
    const actualBuffer = Buffer.from(computedHash, "hex");

    if (
      expectedBuffer.length !== actualBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, actualBuffer)
    ) {
      return res.status(401).json({
        error: `Invalid verification code. Attempt ${record.attempts} of 5.`,
      });
    }

    // Success: remove single-use OTP
    otpStore.delete(normalized);

    // Generate session token
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
