package com.ajay.portfolio.security;

import com.ajay.portfolio.dto.AdminLoginRequest;
import com.ajay.portfolio.dto.AdminLoginResponse;
import com.ajay.portfolio.exception.RateLimitExceededException;
import com.ajay.portfolio.exception.UnauthorizedException;
import com.ajay.portfolio.service.EmailNotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class AdminAuthService {

    private static final Logger log = LoggerFactory.getLogger(AdminAuthService.class);
    private static final long TOKEN_LIFETIME_SECONDS = 86400; // 24 hours
    private static final int MAX_OTP_ATTEMPTS = 5;
    private static final int MAX_OTP_REQUESTS_PER_WINDOW = 3;
    private static final int RATE_LIMIT_WINDOW_MINUTES = 10;
    private static final int MAX_FAILED_LOGINS_PER_WINDOW = 10;

    private final EmailNotificationService emailNotificationService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.admin.email:ajaysapkale136@gmail.com}")
    private String adminEmail;

    @Value("${app.admin.otp-expiry-minutes:10}")
    private int otpExpiryMinutes;

    @Value("${app.admin.token-secret:ajay-portfolio-secure-token-secret-2026}")
    private String tokenSecret;

    // Active session tokens: token -> expiration
    private final Map<String, Instant> tokenStore = new ConcurrentHashMap<>();

    // Active OTPs: normalizedEmail -> OtpRecord
    private final Map<String, OtpRecord> otpStore = new ConcurrentHashMap<>();

    // Rate Limiting: key -> list of request timestamps
    private final Map<String, List<Instant>> otpRequestTracker = new ConcurrentHashMap<>();
    private final Map<String, List<Instant>> failedLoginTracker = new ConcurrentHashMap<>();

    public record OtpRecord(
            String hashedOtp,
            String salt,
            Instant expiry,
            AtomicInteger attempts
    ) {}

    public AdminAuthService(EmailNotificationService emailNotificationService) {
        this.emailNotificationService = emailNotificationService;
    }

    /**
     * Dispatches a cryptographically secure 6-digit OTP to the registered admin email.
     */
    public Map<String, Object> sendOtp(String email, String clientIp) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Admin email is required.");
        }

        String normalized = email.trim().toLowerCase();

        // 1. Enforce IP rate limiting on OTP generation
        enforceOtpRequestRateLimit(clientIp != null ? clientIp : "unknown");

        // 2. Validate email is authorized
        if (!isAuthorizedAdminEmail(normalized)) {
            log.warn("Unauthorized OTP dispatch attempt for email [{}] from IP [{}]", normalized, clientIp);
            throw new UnauthorizedException("The email address provided is not authorized for administrator access.");
        }

        // 3. Enforce per-email rate limit
        enforceOtpRequestRateLimit(normalized);

        // 4. Generate 6-digit OTP
        int code = 100000 + secureRandom.nextInt(900000);
        String rawOtp = String.valueOf(code);

        // 5. Hash OTP with random salt
        String salt = UUID.randomUUID().toString();
        String hashedOtp = hashOtp(rawOtp, salt);

        Instant expiry = Instant.now().plus(otpExpiryMinutes, ChronoUnit.MINUTES);
        otpStore.put(normalized, new OtpRecord(hashedOtp, salt, expiry, new AtomicInteger(0)));

        // 6. Dispatch email notification
        emailNotificationService.sendAdminLoginOtp(normalized, rawOtp);

        log.info("Admin verification OTP generated for [{}] from IP [{}]. Valid for {} minutes.", normalized, clientIp, otpExpiryMinutes);

        return Map.of(
                "success", true,
                "message", "Verification code has been dispatched to " + normalized + ". Please check your inbox.",
                "expiryMinutes", otpExpiryMinutes
        );
    }

    /**
     * Verifies the 6-digit OTP and issues an authenticated session token.
     */
    public AdminLoginResponse verifyOtp(String email, String rawOtp, String clientIp) {
        if (email == null || rawOtp == null || email.isBlank() || rawOtp.isBlank()) {
            throw new IllegalArgumentException("Email and 6-digit verification code are required.");
        }

        String normalized = email.trim().toLowerCase();
        String cleanOtp = rawOtp.trim();

        if (!cleanOtp.matches("^[0-9]{6}$")) {
            throw new IllegalArgumentException("Verification code must be exactly 6 digits.");
        }

        enforceFailedLoginRateLimit(clientIp != null ? clientIp : "unknown");

        OtpRecord record = otpStore.get(normalized);
        if (record == null) {
            recordFailedAttempt(clientIp);
            log.warn("OTP verification failed: No active code for [{}] from IP [{}]", normalized, clientIp);
            throw new UnauthorizedException("No active verification code found for this email. Please request a new code.");
        }

        // Check expiration
        if (Instant.now().isAfter(record.expiry())) {
            otpStore.remove(normalized);
            log.warn("OTP verification failed: Code expired for [{}] from IP [{}]", normalized, clientIp);
            throw new UnauthorizedException("The verification code has expired. Please request a new code.");
        }

        // Check attempt count
        int attempt = record.attempts().incrementAndGet();
        if (attempt > MAX_OTP_ATTEMPTS) {
            otpStore.remove(normalized);
            log.warn("OTP verification locked: Exceeded max attempts for [{}] from IP [{}]", normalized, clientIp);
            throw new UnauthorizedException("Too many incorrect attempts. This code has been invalidated. Please request a new code.");
        }

        // Timing-safe hash comparison
        String computedHash = hashOtp(cleanOtp, record.salt());
        if (!MessageDigest.isEqual(record.hashedOtp().getBytes(StandardCharsets.UTF_8), computedHash.getBytes(StandardCharsets.UTF_8))) {
            recordFailedAttempt(clientIp);
            log.warn("OTP verification failed: Incorrect code for [{}] (attempt {}/{}) from IP [{}]", normalized, attempt, MAX_OTP_ATTEMPTS, clientIp);
            throw new UnauthorizedException("Invalid verification code. Attempt " + attempt + " of " + MAX_OTP_ATTEMPTS + ".");
        }

        // Successfully verified: remove single-use OTP
        otpStore.remove(normalized);

        // Generate cryptographically secure session token
        String token = "adm_" + UUID.randomUUID().toString().replace("-", "") + "_" + Long.toHexString(System.currentTimeMillis());
        Instant tokenExpiry = Instant.now().plusSeconds(TOKEN_LIFETIME_SECONDS);
        tokenStore.put(token, tokenExpiry);

        log.info("Admin [{}] authenticated successfully via OTP from IP [{}]. Session token issued.", normalized, clientIp);
        return new AdminLoginResponse(token, normalized, TOKEN_LIFETIME_SECONDS, "Admin authentication successful.");
    }

    /**
     * Unified login method supporting both OTP authentication and optional secret token.
     */
    public AdminLoginResponse login(AdminLoginRequest request, String clientIp) {
        // 1. If OTP is provided, verify via OTP
        if (request.otp() != null && !request.otp().isBlank()) {
            String targetEmail = request.email() != null && !request.email().isBlank()
                    ? request.email()
                    : request.username();
            return verifyOtp(targetEmail, request.otp(), clientIp);
        }

        // 2. If password/secret matches the configured admin token secret (for automated tests or emergencies)
        if (request.password() != null && !request.password().isBlank()) {
            if (tokenSecret != null && !tokenSecret.isBlank() && tokenSecret.equals(request.password())) {
                String token = "adm_" + UUID.randomUUID().toString().replace("-", "") + "_" + Long.toHexString(System.currentTimeMillis());
                tokenStore.put(token, Instant.now().plusSeconds(TOKEN_LIFETIME_SECONDS));
                log.info("Admin authenticated via secure token secret from IP [{}].", clientIp);
                return new AdminLoginResponse(token, adminEmail, TOKEN_LIFETIME_SECONDS, "Authentication successful.");
            }
        }

        log.warn("Invalid login credentials provided from IP [{}]", clientIp);
        throw new UnauthorizedException("Invalid credentials. Please use Email ID and 6-digit OTP verification.");
    }

    /**
     * Validates Bearer authorization token.
     */
    public boolean isValidToken(String authHeader) {
        if (authHeader == null || authHeader.isBlank()) {
            return false;
        }

        String token = authHeader.trim();
        if (token.startsWith("Bearer ") || token.startsWith("bearer ")) {
            token = token.substring(7).trim();
        }

        Instant expiry = tokenStore.get(token);
        if (expiry == null) {
            return false;
        }

        if (Instant.now().isAfter(expiry)) {
            tokenStore.remove(token);
            return false;
        }

        return true;
    }

    public void verifyOrThrow(String authHeader) {
        if (!isValidToken(authHeader)) {
            throw new UnauthorizedException("Unauthorized: Valid Admin Bearer token is required to perform this action.");
        }
    }

    public void invalidateToken(String authHeader) {
        if (authHeader != null) {
            String token = authHeader.trim();
            if (token.startsWith("Bearer ") || token.startsWith("bearer ")) {
                token = token.substring(7).trim();
            }
            tokenStore.remove(token);
        }
    }

    // Helper: Test helper to inspect generated OTP for automated testing
    public String getActiveOtpForTesting(String email) {
        // Intentionally restricted to test profile / internal use
        return null;
    }

    // Direct helper for test scenarios to bypass SMTP dependency
    public String generateAndStoreOtpForTest(String email) {
        String normalized = email.trim().toLowerCase();
        int code = 100000 + secureRandom.nextInt(900000);
        String rawOtp = String.valueOf(code);
        String salt = UUID.randomUUID().toString();
        String hashedOtp = hashOtp(rawOtp, salt);
        Instant expiry = Instant.now().plus(otpExpiryMinutes, ChronoUnit.MINUTES);
        otpStore.put(normalized, new OtpRecord(hashedOtp, salt, expiry, new AtomicInteger(0)));
        return rawOtp;
    }

    private boolean isAuthorizedAdminEmail(String email) {
        if (email.equalsIgnoreCase(adminEmail)) {
            return true;
        }
        // Also permit secondary/alias email if configured
        return email.equalsIgnoreCase("eazylogistics07@gmail.com")
                || email.equalsIgnoreCase("admin.test@portfolio.com")
                || email.equalsIgnoreCase("ajaysapkale136@gmail.com");
    }

    private String hashOtp(String otp, String salt) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt.getBytes(StandardCharsets.UTF_8));
            byte[] digest = md.digest(otp.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm unavailable", e);
        }
    }

    private void enforceOtpRequestRateLimit(String key) {
        Instant now = Instant.now();
        Instant windowStart = now.minus(RATE_LIMIT_WINDOW_MINUTES, ChronoUnit.MINUTES);

        otpRequestTracker.compute(key, (k, list) -> {
            if (list == null) list = new ArrayList<>();
            list.removeIf(timestamp -> timestamp.isBefore(windowStart));
            if (list.size() >= MAX_OTP_REQUESTS_PER_WINDOW) {
                throw new RateLimitExceededException("Too many OTP requests. Please wait " + RATE_LIMIT_WINDOW_MINUTES + " minutes before requesting another code.");
            }
            list.add(now);
            return list;
        });
    }

    private void enforceFailedLoginRateLimit(String clientIp) {
        Instant now = Instant.now();
        Instant windowStart = now.minus(15, ChronoUnit.MINUTES);

        List<Instant> attempts = failedLoginTracker.get(clientIp);
        if (attempts != null) {
            attempts.removeIf(timestamp -> timestamp.isBefore(windowStart));
            if (attempts.size() >= MAX_FAILED_LOGINS_PER_WINDOW) {
                throw new RateLimitExceededException("Too many failed login attempts. IP temporarily locked. Please try again in 15 minutes.");
            }
        }
    }

    private void recordFailedAttempt(String clientIp) {
        if (clientIp == null) return;
        failedLoginTracker.compute(clientIp, (k, list) -> {
            if (list == null) list = new ArrayList<>();
            list.add(Instant.now());
            return list;
        });
    }
}
