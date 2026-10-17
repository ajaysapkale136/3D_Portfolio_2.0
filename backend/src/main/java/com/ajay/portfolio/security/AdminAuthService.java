package com.ajay.portfolio.security;

import com.ajay.portfolio.dto.AdminLoginRequest;
import com.ajay.portfolio.dto.AdminLoginResponse;
import com.ajay.portfolio.exception.UnauthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AdminAuthService {

    private static final Logger log = LoggerFactory.getLogger(AdminAuthService.class);

    @Value("${app.admin.username:admin}")
    private String adminUsername;

    @Value("${app.admin.password:admin123}")
    private String adminPassword;

    // Token -> Expiry Instant (24 hours)
    private final Map<String, Instant> tokenStore = new ConcurrentHashMap<>();
    private static final long TOKEN_LIFETIME_SECONDS = 86400; // 24 hours

    public AdminLoginResponse login(AdminLoginRequest request) {
        if (!adminUsername.equals(request.username()) || !adminPassword.equals(request.password())) {
            log.warn("Failed admin login attempt for username: {}", request.username());
            throw new UnauthorizedException("Invalid admin username or password.");
        }

        String token = "adm_" + UUID.randomUUID().toString().replace("-", "");
        Instant expiry = Instant.now().plusSeconds(TOKEN_LIFETIME_SECONDS);
        tokenStore.put(token, expiry);

        log.info("Admin authenticated successfully. Issued token valid for 24h.");
        return new AdminLoginResponse(token, adminUsername, TOKEN_LIFETIME_SECONDS, "Authentication successful.");
    }

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
}
