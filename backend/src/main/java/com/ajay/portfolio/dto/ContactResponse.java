package com.ajay.portfolio.dto;

public record ContactResponse(
    Long id,
    String message,
    boolean success,
    String timestamp
) {
    public ContactResponse(Long id, String message) {
        this(id, message, true, java.time.LocalDateTime.now().toString());
    }
}
