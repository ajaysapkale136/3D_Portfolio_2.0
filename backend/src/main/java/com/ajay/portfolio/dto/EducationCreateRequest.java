package com.ajay.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

public record EducationCreateRequest(
    @NotBlank String school,
    @NotBlank String degree,
    String dateRange,
    String grade,
    String description
) {}
