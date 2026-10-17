package com.ajay.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

public record SkillCreateRequest(
    @NotBlank String category,
    @NotBlank String name,
    String imageUrl
) {}
