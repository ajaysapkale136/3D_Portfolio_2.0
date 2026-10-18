package com.ajay.portfolio.controller;

import com.ajay.portfolio.security.AdminAuthService;
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

    @Autowired
    private AdminAuthService adminAuthService;

    @Test
    void testAdminEndpointsRequireAuth() throws Exception {
        mockMvc.perform(get("/api/admin/messages"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/admin/messages/paged"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/admin/projects"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/admin/projects/paged"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/admin/stats"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testSendOtpUnauthorizedEmailFails() throws Exception {
        String json = """
                {
                    "email": "unauthorized.attacker@example.com"
                }
                """;

        mockMvc.perform(post("/api/auth/send-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testSendOtpInvalidEmailReturnsBadRequest() throws Exception {
        String json = """
                {
                    "email": "not-an-email"
                }
                """;

        mockMvc.perform(post("/api/auth/send-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void testVerifyOtpInvalidFormatReturnsBadRequest() throws Exception {
        String json = """
                {
                    "email": "admin.test@portfolio.com",
                    "otp": "123"
                }
                """;

        mockMvc.perform(post("/api/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void testVerifyOtpIncorrectCodeFails() throws Exception {
        String json = """
                {
                    "email": "admin.test@portfolio.com",
                    "otp": "000000"
                }
                """;

        mockMvc.perform(post("/api/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testHardcodedBypassCodesAreStrictlyRejected() throws Exception {
        String json = """
                {
                    "email": "ajaysapkale136@gmail.com",
                    "otp": "202600"
                }
                """;

        mockMvc.perform(post("/api/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testAdminOtpFlowAndAccess() throws Exception {
        // 1. Dispatch OTP for authorized test admin email
        String otp = adminAuthService.generateAndStoreOtpForTest("admin.test@portfolio.com");

        // 2. Verify OTP
        String verifyJson = String.format("""
                {
                    "email": "admin.test@portfolio.com",
                    "otp": "%s"
                }
                """, otp);

        MvcResult loginResult = mockMvc.perform(post("/api/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(verifyJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.username").value("admin.test@portfolio.com"))
                .andReturn();

        JsonNode jsonNode = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String token = jsonNode.get("token").asText();

        // 3. Verify session token via /api/auth/verify
        mockMvc.perform(get("/api/auth/verify")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(true))
                .andExpect(jsonPath("$.role").value("ADMIN"));

        // 4. Access protected stats endpoint
        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.healthStatus").value("UP"));

        // 5. Access paged messages and projects
        mockMvc.perform(get("/api/admin/messages/paged?page=0&size=5")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        mockMvc.perform(get("/api/admin/projects/paged?page=0&size=5")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        // 6. Update Resume Link & Bio via Admin Endpoint
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

        // 7. Verify public bio reflects the updated resume link!
        mockMvc.perform(get("/api/bio"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resume").value("https://drive.google.com/file/d/test-updated-resume/view"));

        // 8. Logout
        mockMvc.perform(post("/api/auth/logout")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        // 9. After logout, token must be rejected
        mockMvc.perform(get("/api/auth/verify")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(false));
    }
}
