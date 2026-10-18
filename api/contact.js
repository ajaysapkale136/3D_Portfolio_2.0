// Vercel Serverless Function: /api/contact
// Receives contact inquiries from portfolio visitors

module.exports = async function handler(req, res) {
  // CORS setup
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { name, email, phoneNumber, subject, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Missing required fields (name, email, message)",
        success: false
      });
    }

    const messageId = Date.now();
    console.log(`[Contact] Received inquiry #${messageId} from ${name} (${email}) - Subject: ${subject || "General Inquiry"}`);

    return res.status(200).json({
      id: messageId,
      message: "Thank you for reaching out! Your message has been received and Ajay will get back to you shortly.",
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      error: "Internal server error processing contact message",
      success: false
    });
  }
};
