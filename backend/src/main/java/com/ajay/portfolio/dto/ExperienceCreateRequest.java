package com.ajay.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

public record ExperienceCreateRequest(
    @NotBlank String company,
    @NotBlank String role,
    String dateRange,
    String description,
    String skills,
    String certificateUrl
) {}
