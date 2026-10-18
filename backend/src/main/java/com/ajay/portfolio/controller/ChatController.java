package com.ajay.portfolio.controller;

import com.ajay.portfolio.dto.ChatRequest;
import com.ajay.portfolio.dto.ChatResponse;
import com.ajay.portfolio.security.ClientIpResolver;
import com.ajay.portfolio.service.PortfolioChatService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final PortfolioChatService chatService;
    private final ClientIpResolver clientIpResolver;

    public ChatController(PortfolioChatService chatService, ClientIpResolver clientIpResolver) {
        this.chatService = chatService;
        this.clientIpResolver = clientIpResolver;
    }

    @PostMapping
    public ChatResponse chat(@Valid @RequestBody ChatRequest request, HttpServletRequest httpRequest) {
        String clientIp = clientIpResolver.resolveClientIp(httpRequest);
        String reply = chatService.reply(request.message(), clientIp);
        return new ChatResponse(reply);
    }
}
