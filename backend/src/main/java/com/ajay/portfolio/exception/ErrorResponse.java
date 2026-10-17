package com.ajay.portfolio.exception;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorResponse(
    int status,
    String error,
    String message,
    List<String> details,
    String path,
    LocalDateTime timestamp
) {
    public ErrorResponse(int status, String error, String message, String path) {
        this(status, error, message, List.of(), path, LocalDateTime.now());
    }

    public ErrorResponse(int status, String error, String message, List<String> details, String path) {
        this(status, error, message, details, path, LocalDateTime.now());
    }
}
