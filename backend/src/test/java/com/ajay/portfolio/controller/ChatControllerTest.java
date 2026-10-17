package com.ajay.portfolio.controller;

import com.ajay.portfolio.service.PortfolioChatService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ChatControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PortfolioChatService chatService;

    @Test
    void testChatSuccess() throws Exception {
        when(chatService.reply(anyString(), anyString()))
                .thenReturn("Ajay has extensive experience with Spring Boot and Java.");

        String json = """
                {
                    "message": "Tell me about Ajay's Spring Boot experience"
                }
                """;

        mockMvc.perform(post("/api/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reply").value("Ajay has extensive experience with Spring Boot and Java."))
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testChatBlankMessageReturnsBadRequest() throws Exception {
        String json = """
                {
                    "message": "   "
                }
                """;

        mockMvc.perform(post("/api/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Validation Failed"));
    }

    @Test
    void testChatOverlongMessageReturnsBadRequest() throws Exception {
        String longMessage = "a".repeat(1001);
        String json = "{\"message\": \"" + longMessage + "\"}";

        mockMvc.perform(post("/api/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }
}
