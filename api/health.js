// Vercel Serverless Function: /api/health
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
    service: "3D Portfolio API",
    platform: "Vercel Serverless"
  });
};
