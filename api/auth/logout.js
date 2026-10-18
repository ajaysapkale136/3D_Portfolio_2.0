// Vercel Serverless Function: /api/auth/logout
const { tokenStore } = require("./_store");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const authHeader = req.headers["authorization"] || "";
  let token = authHeader.trim();
  if (token.startsWith("Bearer ") || token.startsWith("bearer ")) {
    token = token.substring(7).trim();
  }

  if (token) {
    tokenStore.delete(token);
  }

  return res.status(200).json({ message: "Logged out successfully" });
};
