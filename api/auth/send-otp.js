// Vercel Serverless Function: /api/auth/send-otp
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const {
  otpStore,
  isAuthorizedAdmin,
  hashOtp,
  generateHmacChallenge,
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
    const { email } = req.body || {};
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    const normalized = email.toLowerCase().trim();

    // 1. Authorization check
    if (!isAuthorizedAdmin(normalized)) {
      return res.status(401).json({
        error: "The email address provided is not authorized for administrator access.",
      });
    }

    // 2. Rate limiting (max 5 requests per 10 minutes)
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "ip";
    if (!checkRateLimit(`otp_${ip}`, 5, 10)) {
      return res.status(429).json({
        error: "Too many OTP requests. Please wait before requesting another code.",
      });
    }

    // 3. Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000);
    const rawOtp = String(code);
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedOtp = hashOtp(rawOtp, salt);
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Generate stateless cryptographic HMAC challenge token
    const challengeToken = generateHmacChallenge(normalized, rawOtp, expiry);

    // Also cache in memory for warm instances
    otpStore.set(normalized, {
      hashedOtp,
      salt,
      expiry,
      attempts: 0,
    });

    // 4. Send email via Nodemailer using verified Gmail SMTP
    const mailUser = process.env.SPRING_MAIL_USERNAME || "eazylogistics07@gmail.com";
    const mailPass = process.env.SPRING_MAIL_PASSWORD || "mtzfiadqkpdtsmxw";

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: mailUser,
          pass: mailPass,
        },
      });

      await transporter.sendMail({
        from: `"Ajay's 3D Portfolio Security" <${mailUser}>`,
        to: normalized,
        subject: `[Portfolio Security] Your Admin Login Verification Code: ${rawOtp}`,
        text: `Hello Ajay,\n\nYour one-time verification code (OTP) for accessing the 3D Portfolio Admin Portal is:\n\n${rawOtp}\n\n• Valid for 10 minutes\n• Single-use only\n• If you did not initiate this login request, please disregard this email.\n\nBest regards,\nPortfolio Security System`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #334155; border-radius: 12px; background-color: #0f172a; color: #f8fafc;">
            <h2 style="color: #22d3ee; margin-top: 0; display: flex; align-items: center; gap: 8px;">
              🔐 3D Portfolio Admin Verification
            </h2>
            <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
              A login request was initiated for your administrator portal. Enter the 6-digit verification code below to authenticate:
            </p>
            <div style="margin: 24px 0; padding: 20px; text-align: center; background: rgba(34, 211, 238, 0.08); border: 1px solid #22d3ee; border-radius: 10px;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #38bdf8; font-family: monospace;">${rawOtp}</span>
            </div>
            <p style="font-size: 12.5px; color: #64748b; line-height: 1.5; margin-bottom: 0;">
              • Code expires in <strong>10 minutes</strong>.<br/>
              • Never share this verification code with anyone.<br/>
              • If you did not initiate this request, your account is safe; please disregard this email.
            </p>
          </div>
        `,
      });
      console.log(`[send-otp] Dispatched verification email to ${normalized}`);
    } catch (mailErr) {
      console.warn("[send-otp] Nodemailer dispatch error:", mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: `Verification code dispatched to ${normalized}. Please check your inbox.`,
      expiryMinutes: 10,
      challengeToken,
    });
  } catch (err) {
    console.error("send-otp error:", err);
    return res.status(500).json({ error: "Failed to dispatch verification code. Please try again." });
  }
};
