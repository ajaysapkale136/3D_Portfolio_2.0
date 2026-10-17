import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import styled from "styled-components";
import { submitContactMessage } from "../../utils/api";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
  padding: 0 16px;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;
const Title = styled.div`
  font-size: 48px;
  text-align: center;
  font-weight: 800;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;
const Desc = styled.div`
  max-width: 720px;
  font-size: 17px;
  line-height: 1.7;
  text-align: center;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ContactForm = styled.form`
  width: 95%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.66));
  border: 1px solid ${({ theme }) => theme.border};
  padding: 34px;
  border-radius: 20px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
  margin-top: 28px;
  gap: 14px;
  backdrop-filter: blur(16px);
`;
const ContactTitle = styled.div`
  font-size: 26px;
  margin-bottom: 6px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;
const ContactInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid ${({ theme }) => theme.border};
  outline: none;
  font-size: 15px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 14px;
  padding: 14px 16px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  &:focus {
    background: rgba(255, 255, 255, 0.065);
    border-color: ${({ theme }) => theme.accent};
    box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.08);
  }
`;
const ContactInputMessage = styled.textarea`
  flex: 1;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid ${({ theme }) => theme.border};
  outline: none;
  font-size: 15px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 14px;
  padding: 14px 16px;
  resize: vertical;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  &:focus {
    background: rgba(255, 255, 255, 0.065);
    border-color: ${({ theme }) => theme.accent};
    box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.08);
  }
`;
const ContactButton = styled.input`
  width: 100%;
  text-decoration: none;
  text-align: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.accent});
  padding: 14px 16px;
  margin-top: 2px;
  border-radius: 999px;
  border: none;
  color: ${({ theme }) => theme.text_primary};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  box-shadow: 0 18px 42px rgba(139, 92, 246, 0.24);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  &:hover {
    transform: ${({ disabled }) => (disabled ? "none" : "translateY(-2px)")};
    box-shadow: 0 22px 52px rgba(34, 211, 238, 0.18);
  }
`;
const StatusMessage = styled.p`
  min-height: 22px;
  color: ${({ $tone, theme }) =>
    $tone === "error" ? "#ff7b7b" : theme.text_secondary};
  font-size: 14px;
`;

const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState({ message: "", tone: "info" });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(form.current);
    const payload = {
      name: formData.get("from_name") || "",
      email: formData.get("from_email") || "",
      phoneNumber: formData.get("contact_number") || "",
      subject: formData.get("subject") || "",
      message: formData.get("message") || "",
    };

    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
    const hasEmailJs = Boolean(serviceId && templateId && publicKey);

    setIsSending(true);
    setStatus({ message: "Sending your message...", tone: "info" });

    let backendSuccess = false;
    let emailJsSuccess = false;
    let lastError = "";

    // 1. Dispatch to Spring Boot Backend API
    try {
      await submitContactMessage(payload);
      backendSuccess = true;
    } catch (err) {
      lastError = err.message || "Failed to reach portfolio server.";
    }

    // 2. Dispatch to EmailJS if configured
    if (hasEmailJs) {
      try {
        await emailjs.sendForm(serviceId, templateId, form.current, publicKey);
        emailJsSuccess = true;
      } catch (err) {
        if (!backendSuccess) {
          lastError = "Message could not be sent. Please try again.";
        }
      }
    }

    if (backendSuccess || emailJsSuccess) {
      setStatus({ message: "Message sent successfully.", tone: "success" });
      form.current.reset();
    } else if (!hasEmailJs && !backendSuccess) {
      setStatus({
        message: lastError || "Service temporarily unavailable. Please try again later.",
        tone: "error",
      });
    } else {
      setStatus({
        message: "Message could not be sent. Please try again.",
        tone: "error",
      });
    }

    setIsSending(false);
  };
  return (
    <Container id="Contact">
      <Wrapper>
        <Title>Contact</Title>
        <Desc
          style={{
            marginBottom: "40px",
          }}
        >
          Feel free to reach out to me for any questions or opportunities!
        </Desc>
        <ContactForm ref={form} onSubmit={handleSubmit}>
          <ContactTitle>Email Me</ContactTitle>
          <ContactInput
            placeholder="Your Email"
            name="from_email"
            type="email"
            required
          />
          <ContactInput placeholder="Your Name" name="from_name" required />
          <ContactInput
            placeholder="Your Contact / Phone Number"
            name="contact_number"
            type="tel"
          />
          <ContactInput placeholder="Subject" name="subject" required />
          <ContactInputMessage
            placeholder="Message"
            name="message"
            rows={4}
            required
          />
          <ContactButton
            type="submit"
            value={isSending ? "Sending..." : "Send"}
            disabled={isSending}
          />
          <StatusMessage $tone={status.tone} aria-live="polite">
            {status.message}
          </StatusMessage>
        </ContactForm>
      </Wrapper>
    </Container>
  );
};

export default Contact;
