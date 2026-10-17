package com.ajay.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

public record ProjectCreateRequest(
    @NotBlank String title,
    String dateRange,
    String description,
    String imageUrl,
    String tags,
    String category,
    String githubUrl,
    String liveUrl,
    Boolean published
) {}
