package com.ajay.portfolio.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testAdminEndpointsRequireAuth() throws Exception {
        mockMvc.perform(get("/api/admin/messages"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/admin/projects"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/admin/stats"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testAdminLoginAndAccess() throws Exception {
        // 1. Perform Admin Login
        String loginJson = """
                {
                    "username": "admin",
                    "password": "admin123"
                }
                """;

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andReturn();

        JsonNode jsonNode = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String token = jsonNode.get("token").asText();

        // 2. Access protected endpoint with Bearer token
        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.healthStatus").value("UP"));

        // 3. Access admin messages
        mockMvc.perform(get("/api/admin/messages")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        // 4. Update Resume Link & Bio via Admin Endpoint
        String bioUpdateJson = """
                {
                    "name": "Ajay Sapkale",
                    "roles": "Java Full Stack Developer, Spring AI Specialist",
                    "description": "Updated via Admin Portal",
                    "github": "https://github.com/ajaysapkale136",
                    "resume": "https://drive.google.com/file/d/test-updated-resume/view",
                    "linkedin": "https://www.linkedin.com/in/ajay-sapkale-5352782a2"
                }
                """;

        mockMvc.perform(put("/api/admin/bio")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bioUpdateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resume").value("https://drive.google.com/file/d/test-updated-resume/view"));

        // 5. Verify public bio reflects the updated resume link!
        mockMvc.perform(get("/api/bio"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resume").value("https://drive.google.com/file/d/test-updated-resume/view"));
    }
}
