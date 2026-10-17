package com.ajay.portfolio.dto;

import java.util.List;

public record ExperienceDto(
    Long id,
    String img,
    String role,
    String company,
    String date,
    String desc,
    List<String> skills,
    String doc
) {}
