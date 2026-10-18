package com.ajay.portfolio.controller;

import com.ajay.portfolio.dto.ContactRequest;
import com.ajay.portfolio.dto.ContactResponse;
import com.ajay.portfolio.security.ClientIpResolver;
import com.ajay.portfolio.service.ContactService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;
    private final ClientIpResolver clientIpResolver;

    public ContactController(ContactService contactService, ClientIpResolver clientIpResolver) {
        this.contactService = contactService;
        this.clientIpResolver = clientIpResolver;
    }

    @PostMapping
    public ResponseEntity<ContactResponse> submitContact(
            @Valid @RequestBody ContactRequest request,
            HttpServletRequest httpRequest) {
        String clientIp = clientIpResolver.resolveClientIp(httpRequest);
        ContactResponse response = contactService.saveMessage(request, clientIp);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
