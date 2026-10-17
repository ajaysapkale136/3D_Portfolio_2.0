package com.ajay.portfolio.dto;

import java.util.List;

public record ProjectDto(
    Long id,
    String title,
    String date,
    String description,
    String image,
    List<String> tags,
    String category,
    String github,
    String webapp
) {}
