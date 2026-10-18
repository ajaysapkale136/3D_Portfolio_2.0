// Vercel Serverless Function: /api/auth/login
const verifyOtpHandler = require("./verify-otp");
const { tokenStore, isMasterCode } = require("./_store");
const crypto = require("crypto");

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

  const { email, otp, username, password } = req.body || {};
  const cleanEmail = (email || username || "ajaysapkale136@gmail.com").trim().toLowerCase();
  const candidate = String(otp || password || "").trim();

  // If Master PIN / secret is provided in either field
  if (isMasterCode(candidate)) {
    const token = "adm_" + crypto.randomBytes(24).toString("hex");
    const expiresIn = 86400;
    tokenStore.set(token, Date.now() + expiresIn * 1000);
    return res.status(200).json({
      token,
      username: cleanEmail,
      expiresIn,
      message: "Admin authentication successful (Master PIN).",
    });
  }

  // Pass to verify-otp handler
  req.body.email = cleanEmail;
  req.body.otp = candidate;
  return verifyOtpHandler(req, res);
};
