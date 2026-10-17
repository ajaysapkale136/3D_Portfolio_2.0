package com.ajay.portfolio.service;

import com.ajay.portfolio.dto.ContactRequest;
import com.ajay.portfolio.dto.ContactResponse;
import com.ajay.portfolio.entity.ContactMessage;
import com.ajay.portfolio.exception.RateLimitExceededException;
import com.ajay.portfolio.repository.ContactMessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final ContactMessageRepository repository;
    private final EmailNotificationService emailNotificationService;

    public ContactService(ContactMessageRepository repository, EmailNotificationService emailNotificationService) {
        this.repository = repository;
        this.emailNotificationService = emailNotificationService;
    }

    @Transactional
    public ContactResponse saveMessage(ContactRequest request, String clientIp) {
        LocalDateTime window = LocalDateTime.now().minusMinutes(10);

        // Spam prevention / Rate limiting
        long recentByEmail = repository.countByEmailAndCreatedAtAfter(request.email().trim().toLowerCase(), window);
        if (recentByEmail >= 5) {
            log.warn("Rate limit triggered for contact email: {}", request.email());
            throw new RateLimitExceededException("Too many contact requests from this email. Please wait a few minutes.");
        }

        if (clientIp != null && !clientIp.isBlank()) {
            long recentByIp = repository.countByClientIpAndCreatedAtAfter(clientIp, window);
            if (recentByIp >= 10) {
                log.warn("Rate limit triggered for contact IP: {}", clientIp);
                throw new RateLimitExceededException("Too many contact submissions from your IP. Please try again later.");
            }
        }

        ContactMessage message = new ContactMessage(
                request.name().trim(),
                request.email().trim().toLowerCase(),
                request.phoneNumber() != null ? request.phoneNumber().trim() : "",
                request.subject().trim(),
                request.message().trim(),
                clientIp
        );

        ContactMessage saved = repository.save(message);
        log.info("Saved contact message #{} from {}", saved.getId(), saved.getEmail());

        // Dispatch email notification
        try {
            emailNotificationService.sendContactNotification(saved);
        } catch (Exception e) {
            log.warn("Could not send email notification: {}", e.getMessage());
        }

        return new ContactResponse(saved.getId(), "Thank you! Your message has been received successfully.");
    }
}
