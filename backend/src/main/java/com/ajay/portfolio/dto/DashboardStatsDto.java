package com.ajay.portfolio.dto;

public record DashboardStatsDto(
    long totalMessages,
    long newMessages,
    long totalProjects,
    long totalSkills,
    String healthStatus,
    String uptime
) {}
