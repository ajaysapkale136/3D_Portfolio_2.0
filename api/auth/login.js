// Vercel Serverless Function: /api/auth/login
const verifyOtpHandler = require("./verify-otp");
const { tokenStore } = require("./_store");
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

  // If OTP is provided, verify via verify-otp
  if (otp) {
    req.body.email = email || username;
    return verifyOtpHandler(req, res);
  }

  // If admin secret is provided
  const adminSecret = process.env.ADMIN_SECRET || "ajay-secret-key-3d-portfolio-2026";
  if (password && password === adminSecret) {
    const token = "adm_" + crypto.randomBytes(24).toString("hex");
    const expiresIn = 86400;
    tokenStore.set(token, Date.now() + expiresIn * 1000);
    return res.status(200).json({
      token,
      username: email || username || "admin",
      expiresIn,
      message: "Admin authentication successful.",
    });
  }

  return res.status(401).json({
    error: "Invalid credentials. Please request an OTP using your registered admin email.",
  });
};
