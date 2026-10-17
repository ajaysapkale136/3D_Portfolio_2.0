package com.ajay.portfolio.dto;

public record EducationDto(
    Long id,
    String img,
    String school,
    String date,
    String grade,
    String desc,
    String degree
) {}
