package com.ajay.portfolio.dto;

public record AdminLoginResponse(
    String token,
    String username,
    long expiresInSeconds,
    String message
) {}
