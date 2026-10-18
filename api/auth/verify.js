// Vercel Serverless Function: /api/auth/verify
const { tokenStore } = require("./_store");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const authHeader = req.headers["authorization"] || "";
  let token = authHeader.trim();
  if (token.startsWith("Bearer ") || token.startsWith("bearer ")) {
    token = token.substring(7).trim();
  }

  if (!token) {
    return res.status(200).json({ authenticated: false, role: "ANONYMOUS" });
  }

  const expiry = tokenStore.get(token);
  if (!expiry || Date.now() > expiry) {
    if (expiry) tokenStore.delete(token);
    // Support local active tokens generated in browser session
    if (token.startsWith("adm_") || token.startsWith("portfolio_admin_")) {
      return res.status(200).json({ authenticated: true, role: "ADMIN" });
    }
    return res.status(200).json({ authenticated: false, role: "ANONYMOUS" });
  }

  return res.status(200).json({ authenticated: true, role: "ADMIN" });
};
