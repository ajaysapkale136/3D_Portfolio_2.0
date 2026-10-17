package com.ajay.portfolio.dto;

import java.util.List;

public record SkillGroupDto(
    String title,
    List<SkillItemDto> skills
) {
    public record SkillItemDto(String name, String image) {}
}
