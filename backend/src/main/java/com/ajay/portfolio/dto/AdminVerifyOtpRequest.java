package com.ajay.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record AdminVerifyOtpRequest(
    @NotBlank(message = "Admin email address is required")
    @Email(message = "Please provide a valid email address")
    String email,

    @NotBlank(message = "Verification OTP is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "Verification code must be exactly 6 digits")
    String otp
) {}
