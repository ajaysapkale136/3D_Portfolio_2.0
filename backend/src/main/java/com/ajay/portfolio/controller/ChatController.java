package com.ajay.portfolio.controller;

import com.ajay.portfolio.dto.ChatRequest;
import com.ajay.portfolio.dto.ChatResponse;
import com.ajay.portfolio.service.PortfolioChatService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final PortfolioChatService chatService;

    public ChatController(PortfolioChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ChatResponse chat(@Valid @RequestBody ChatRequest request, HttpServletRequest httpRequest) {
        String clientIp = extractClientIp(httpRequest);
        String reply = chatService.reply(request.message(), clientIp);
        return new ChatResponse(reply);
    }

    private String extractClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
