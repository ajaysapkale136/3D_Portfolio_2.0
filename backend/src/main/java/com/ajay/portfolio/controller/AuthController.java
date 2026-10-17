package com.ajay.portfolio.controller;

import com.ajay.portfolio.dto.AdminLoginRequest;
import com.ajay.portfolio.dto.AdminLoginResponse;
import com.ajay.portfolio.security.AdminAuthService;
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

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(@Valid @RequestBody AdminLoginRequest request) {
        return ResponseEntity.ok(adminAuthService.login(request));
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
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
