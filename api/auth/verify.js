// Vercel Serverless Function: /api/auth/verify
const crypto = require("crypto");
const { AUTH_SECRET, tokenStore, isAuthorizedAdmin } = require("./_store");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
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

  // 1. Verify signed token format: v1.<payloadB64>.<sig>
  if (token.startsWith("v1.")) {
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const [prefix, payloadB64, sig] = parts;
        const expectedSig = crypto.createHmac("sha256", AUTH_SECRET).update(`${prefix}.${payloadB64}`).digest("hex");
        const expBuffer = Buffer.from(expectedSig, "hex");
        const provBuffer = Buffer.from(sig, "hex");

        if (expBuffer.length === provBuffer.length && crypto.timingSafeEqual(expBuffer, provBuffer)) {
          const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
          if (payload.exp && Math.floor(Date.now() / 1000) <= payload.exp && isAuthorizedAdmin(payload.sub)) {
            return res.status(200).json({ authenticated: true, role: "ADMIN", user: payload.sub });
          }
        }
      }
    } catch (_) {}
  }

  // 2. Fallback to active in-memory token store
  const expiry = tokenStore.get(token);
  if (expiry && Date.now() <= expiry) {
    return res.status(200).json({ authenticated: true, role: "ADMIN" });
  }

  if (expiry) tokenStore.delete(token);
  return res.status(200).json({ authenticated: false, role: "ANONYMOUS" });
};
