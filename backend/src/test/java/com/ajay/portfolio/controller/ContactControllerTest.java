package com.ajay.portfolio.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testContactSuccess() throws Exception {
        String json = """
                {
                    "name": "Recruiter John",
                    "email": "john.recruiter@example.com",
                    "subject": "Interview Opportunity",
                    "message": "Hi Ajay, we are impressed by your full-stack portfolio."
                }
                """;

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.id").isNumber());
    }

    @Test
    void testContactInvalidEmailReturnsBadRequest() throws Exception {
        String json = """
                {
                    "name": "Jane",
                    "email": "invalid-email",
                    "subject": "Hello",
                    "message": "Valid message text"
                }
                """;

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }
}
