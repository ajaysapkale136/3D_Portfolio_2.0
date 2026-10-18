package com.ajay.portfolio.dto;

public record AdminLoginRequest(
    String username,
    String password,
    String email,
    String otp
) {}
