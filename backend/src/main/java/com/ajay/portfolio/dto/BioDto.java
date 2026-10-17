package com.ajay.portfolio.dto;

import java.util.List;

public record BioDto(
    String name,
    List<String> roles,
    String description,
    String github,
    String resume,
    String linkedin,
    String twitter,
    String insta,
    String facebook
) {}
