package com.ajay.portfolio.controller;

import com.ajay.portfolio.dto.AdminLoginRequest;
import com.ajay.portfolio.dto.AdminLoginResponse;
import com.ajay.portfolio.dto.AdminSendOtpRequest;
import com.ajay.portfolio.dto.AdminVerifyOtpRequest;
import com.ajay.portfolio.security.AdminAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AdminAuthService adminAuthService;

    public AuthController(AdminAuthService adminAuthService) {
        this.adminAuthService = adminAuthService;
    }

    /**
     * Request a 6-digit verification OTP to the administrator's email.
     */
    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, Object>> sendOtp(
            @Valid @RequestBody AdminSendOtpRequest request,
            HttpServletRequest httpRequest) {
        String clientIp = extractClientIp(httpRequest);
        Map<String, Object> response = adminAuthService.sendOtp(request.email(), clientIp);
        return ResponseEntity.ok(response);
    }

    /**
     * Verify the 6-digit OTP and authenticate admin session.
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<AdminLoginResponse> verifyOtp(
            @Valid @RequestBody AdminVerifyOtpRequest request,
            HttpServletRequest httpRequest) {
        String clientIp = extractClientIp(httpRequest);
        AdminLoginResponse response = adminAuthService.verifyOtp(request.email(), request.otp(), request.challengeToken(), clientIp);
        return ResponseEntity.ok(response);
    }

    /**
     * Unified login endpoint supporting both OTP verification and emergency secret token.
     */
    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(
            @RequestBody AdminLoginRequest request,
            HttpServletRequest httpRequest) {
        String clientIp = extractClientIp(httpRequest);
        return ResponseEntity.ok(adminAuthService.login(request, clientIp));
    }

    @GetMapping("/verify")
    public ResponseEntity<Map<String, Object>> verify(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        boolean valid = adminAuthService.isValidToken(authHeader);
        return ResponseEntity.ok(Map.of(
                "authenticated", valid,
                "role", valid ? "ADMIN" : "ANONYMOUS"
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.invalidateToken(authHeader);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    private String extractClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
