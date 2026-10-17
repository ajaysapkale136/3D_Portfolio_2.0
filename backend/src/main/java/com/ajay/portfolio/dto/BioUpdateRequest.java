package com.ajay.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

public record BioUpdateRequest(
    @NotBlank String name,
    String roles,
    String description,
    String github,
    String resume,
    String linkedin,
    String twitter,
    String insta,
    String facebook
) {}
