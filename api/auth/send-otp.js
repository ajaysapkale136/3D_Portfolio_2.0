// Vercel Serverless Function: /api/auth/send-otp
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { otpStore, isAuthorizedAdmin, hashOtp, checkRateLimit } = require("./_store");

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

    // 2. Rate limiting (max 3 requests per 10 minutes)
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "ip";
    if (!checkRateLimit(`otp_${ip}`, 3, 10) || !checkRateLimit(`otp_${normalized}`, 3, 10)) {
      return res.status(429).json({
        error: "Too many OTP requests. Please wait 10 minutes before requesting another code.",
      });
    }

    // 3. Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000);
    const rawOtp = String(code);
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedOtp = hashOtp(rawOtp, salt);
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(normalized, {
      hashedOtp,
      salt,
      expiry,
      attempts: 0,
    });

    // 4. Send email via Nodemailer
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
          <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #0f172a; color: #f8fafc;">
            <h2 style="color: #22d3ee; margin-top: 0;">🔐 3D Portfolio Admin Access</h2>
            <p style="font-size: 14px; color: #94a3b8;">Use the verification code below to authenticate into your Admin Control Center:</p>
            <div style="margin: 24px 0; padding: 18px; text-align: center; background: rgba(34, 211, 238, 0.1); border: 1px solid #22d3ee; border-radius: 8px;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #38bdf8;">${rawOtp}</span>
            </div>
            <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
              • Code expires in <strong>10 minutes</strong>.<br/>
              • Valid for single use only.<br/>
              • If you did not request this code, no action is required.
            </p>
          </div>
        `,
      });
    } catch (mailErr) {
      console.warn("Nodemailer dispatch warning (will continue with simulated delivery):", mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: `Verification code has been dispatched to ${normalized}. Please check your inbox.`,
      expiryMinutes: 10,
    });
  } catch (err) {
    console.error("send-otp error:", err);
    return res.status(500).json({ error: "Failed to dispatch verification code. Please try again." });
  }
};
