package com.ajay.portfolio.dto;

public record ChatResponse(
    String reply,
    boolean success,
    String timestamp
) {
    public ChatResponse(String reply) {
        this(reply, true, java.time.LocalDateTime.now().toString());
    }
}
