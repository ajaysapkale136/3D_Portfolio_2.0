package com.ajay.portfolio.service;

import com.ajay.portfolio.entity.ContactMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationService.class);

    private final JavaMailSender mailSender;

    @Value("${app.contact.notification-email:ajaysapkale136@gmail.com}")
    private String recipientEmail;

    @Value("${spring.mail.username:}")
    private String mailSenderUsername;

    public EmailNotificationService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendContactNotification(ContactMessage message) {
        String phoneStr = (message.getPhoneNumber() != null && !message.getPhoneNumber().isBlank())
                ? message.getPhoneNumber()
                : "Not provided";

        String subject = "[Portfolio Alert] New inquiry from " + message.getName() + " - " + message.getSubject();
        String body = String.format("""
                You have received a new contact inquiry through your 3D Portfolio!
                
                Sender Details:
                • Name: %s
                • Email: %s
                • Phone: %s
                • Subject: %s
                • Submitted At: %s
                • Client IP: %s
                
                Message Content:
                --------------------------------------------------
                %s
                --------------------------------------------------
                
                You can review or reply to this message from your Admin Portal:
                http://localhost:3000/admin
                """,
                message.getName(),
                message.getEmail(),
                phoneStr,
                message.getSubject(),
                message.getCreatedAt(),
                message.getClientIp() != null ? message.getClientIp() : "N/A",
                message.getMessage()
        );

        if (mailSender != null && mailSenderUsername != null && !mailSenderUsername.isBlank()) {
            try {
                SimpleMailMessage mailMessage = new SimpleMailMessage();
                mailMessage.setFrom(mailSenderUsername);
                mailMessage.setTo(recipientEmail);
                mailMessage.setReplyTo(message.getEmail());
                mailMessage.setSubject(subject);
                mailMessage.setText(body);

                mailSender.send(mailMessage);
                log.info("Sent email notification for contact inquiry #{} to owner [{}]", message.getId(), maskEmail(recipientEmail));
            } catch (Exception ex) {
                log.error("Failed to dispatch SMTP email notification for inquiry #{}: {}", message.getId(), ex.getMessage());
            }
        } else {
            log.info("Contact inquiry #{} received from [{}] (subject: '{}'). Live mail delivery skipped because SMTP is not configured.",
                    message.getId(), maskEmail(message.getEmail()), message.getSubject());
        }
    }

    public void sendMessageReadReceipt(ContactMessage message) {
        if (message.getEmail() == null || message.getEmail().isBlank()) {
            return;
        }

        String phoneNote = (message.getPhoneNumber() != null && !message.getPhoneNumber().isBlank())
                ? "at your phone number (" + message.getPhoneNumber() + ") or "
                : "";

        String subject = "Ajay Sapkale has seen your message: " + message.getSubject();
        String body = String.format("""
                Hi %s,

                Thank you for reaching out through my portfolio website!

                This is a quick notification to let you know that I have seen and reviewed your message regarding:
                "%s"

                I will be getting in touch with you shortly %svia email (%s).

                Summary of your inquiry:
                --------------------------------------------------
                %s
                --------------------------------------------------

                Best regards,
                Ajay Sapkale
                Full Stack Developer | Java & MERN
                Email: ajaysapkale136@gmail.com
                """,
                message.getName(),
                message.getSubject(),
                phoneNote,
                message.getEmail(),
                message.getMessage()
        );

        if (mailSender != null && mailSenderUsername != null && !mailSenderUsername.isBlank()) {
            try {
                SimpleMailMessage mailMessage = new SimpleMailMessage();
                mailMessage.setFrom(mailSenderUsername);
                mailMessage.setTo(message.getEmail());
                mailMessage.setReplyTo(recipientEmail);
                mailMessage.setSubject(subject);
                mailMessage.setText(body);

                mailSender.send(mailMessage);
                log.info("Sent visitor read receipt notification for inquiry #{} to [{}]", message.getId(), maskEmail(message.getEmail()));
            } catch (Exception ex) {
                log.error("Failed to dispatch visitor read receipt via SMTP for inquiry #{}: {}", message.getId(), ex.getMessage());
            }
        } else {
            log.info("Visitor read receipt for inquiry #{} queued for [{}]. Live mail delivery skipped because SMTP is not configured.",
                    message.getId(), maskEmail(message.getEmail()));
        }
    }

    public void sendAdminLoginOtp(String toEmail, String otp) {
        String subject = "[Portfolio Security] Your Admin Login Verification Code";
        String body = String.format("""
                Hello Ajay,

                Your one-time verification code (OTP) for accessing the 3D Portfolio Admin Portal is:

                ======================================
                               %s
                ======================================

                • This code is valid for 10 minutes.
                • It can only be used once.
                • If you did not initiate this login request, your account is safe; please disregard this email.

                Security Tip: Never share this OTP with anyone.

                Best regards,
                Ajay's 3D Portfolio Security System
                """, otp);

        if (mailSender != null && mailSenderUsername != null && !mailSenderUsername.isBlank()) {
            try {
                SimpleMailMessage mailMessage = new SimpleMailMessage();
                mailMessage.setFrom(mailSenderUsername);
                mailMessage.setTo(toEmail);
                mailMessage.setSubject(subject);
                mailMessage.setText(body);

                mailSender.send(mailMessage);
                log.info("Dispatched admin login verification OTP email to [{}]", maskEmail(toEmail));
            } catch (Exception ex) {
                log.warn("Failed to dispatch OTP email via SMTP to [{}]: {}", maskEmail(toEmail), ex.getMessage());
            }
        } else {
            // Note: Never log OTP digits or secrets into production logs
            log.info("Admin login OTP generated for [{}]. Live mail dispatch skipped because SMTP is not configured.", maskEmail(toEmail));
        }
    }

    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "***";
        }
        int atIdx = email.indexOf('@');
        String name = email.substring(0, atIdx);
        String domain = email.substring(atIdx);
        if (name.length() <= 2) {
            return name.charAt(0) + "***" + domain;
        }
        return name.charAt(0) + "***" + name.charAt(name.length() - 1) + domain;
    }
}
