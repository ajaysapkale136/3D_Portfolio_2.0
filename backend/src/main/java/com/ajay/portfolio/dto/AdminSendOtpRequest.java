package com.ajay.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AdminSendOtpRequest(
    @NotBlank(message = "Admin email address is required")
    @Email(message = "Please provide a valid email address")
    String email
) {}
