// Vercel Serverless Function: /api/auth/login
const verifyOtpHandler = require("./verify-otp");

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

  if (!candidate) {
    return res.status(400).json({ error: "Verification code (OTP) is required." });
  }

  // Strictly forward to OTP verification handler
  req.body.email = cleanEmail;
  req.body.otp = candidate;
  return verifyOtpHandler(req, res);
};
