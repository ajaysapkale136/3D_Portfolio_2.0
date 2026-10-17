package com.ajay.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
    @NotBlank(message = "Name is required")
    @Size(max = 150, message = "Name must not exceed 150 characters")
    String name,

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 200, message = "Email must not exceed 200 characters")
    String email,

    @Size(max = 50, message = "Phone number must not exceed 50 characters")
    String phoneNumber,

    @NotBlank(message = "Subject is required")
    @Size(max = 250, message = "Subject must not exceed 250 characters")
    String subject,

    @NotBlank(message = "Message is required")
    @Size(max = 3000, message = "Message must not exceed 3000 characters")
    String message
) {}
