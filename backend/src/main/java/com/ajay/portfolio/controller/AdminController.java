package com.ajay.portfolio.controller;

import com.ajay.portfolio.dto.*;
import com.ajay.portfolio.entity.ContactMessage;
import com.ajay.portfolio.entity.EducationEntity;
import com.ajay.portfolio.entity.ExperienceEntity;
import com.ajay.portfolio.entity.ProjectEntity;
import com.ajay.portfolio.entity.SkillEntity;
import com.ajay.portfolio.security.AdminAuthService;
import com.ajay.portfolio.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ProjectService projectService;
    private final AdminAuthService adminAuthService;

    public AdminController(ProjectService projectService, AdminAuthService adminAuthService) {
        this.projectService = projectService;
        this.adminAuthService = adminAuthService;
    }

    // ----------------- Analytics / Dashboard Stats -----------------
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        return ResponseEntity.ok(projectService.getStats());
    }

    // ----------------- Contact Messages -----------------
    @GetMapping("/messages")
    public ResponseEntity<List<ContactMessage>> getMessages(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        return ResponseEntity.ok(projectService.getAllMessages());
    }

    @PutMapping("/messages/{id}/status")
    public ResponseEntity<ContactMessage> updateMessageStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        return ResponseEntity.ok(projectService.updateMessageStatus(id, status));
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Map<String, String>> deleteMessage(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        projectService.deleteMessage(id);
        return ResponseEntity.ok(Map.of("message", "Message #" + id + " deleted successfully."));
    }

    // ----------------- Projects CRUD -----------------
    @GetMapping("/projects")
    public ResponseEntity<List<ProjectEntity>> getAdminProjects(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        return ResponseEntity.ok(projectService.getAllProjectsAdmin());
    }

    @PostMapping("/projects")
    public ResponseEntity<ProjectEntity> createProject(
            @Valid @RequestBody ProjectCreateRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        return ResponseEntity.ok(projectService.createProject(request));
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<ProjectEntity> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectCreateRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Map<String, String>> deleteProject(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        projectService.deleteProject(id);
        return ResponseEntity.ok(Map.of("message", "Project #" + id + " deleted successfully."));
    }

    // ----------------- Skills CRUD -----------------
    @GetMapping("/skills")
    public ResponseEntity<List<SkillEntity>> getAdminSkills(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        return ResponseEntity.ok(projectService.getAllSkillsAdmin());
    }

    @PostMapping("/skills")
    public ResponseEntity<SkillEntity> createSkill(
            @Valid @RequestBody SkillCreateRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        return ResponseEntity.ok(projectService.createSkill(request));
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<Map<String, String>> deleteSkill(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        projectService.deleteSkill(id);
        return ResponseEntity.ok(Map.of("message", "Skill #" + id + " deleted successfully."));
    }

    // ----------------- Bio & Resume Management -----------------
    @GetMapping("/bio")
    public ResponseEntity<BioDto> getBio(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        return ResponseEntity.ok(projectService.getBio());
    }

    @PutMapping("/bio")
    public ResponseEntity<BioDto> updateBio(
            @Valid @RequestBody BioUpdateRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        return ResponseEntity.ok(projectService.updateBio(request));
    }

    // ----------------- Experiences / Internships CRUD -----------------
    @GetMapping("/experiences")
    public ResponseEntity<List<ExperienceEntity>> getAdminExperiences(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        return ResponseEntity.ok(projectService.getAllExperiencesAdmin());
    }

    @PostMapping("/experiences")
    public ResponseEntity<ExperienceEntity> createExperience(
            @Valid @RequestBody ExperienceCreateRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        return ResponseEntity.ok(projectService.createExperience(request));
    }

    @PutMapping("/experiences/{id}")
    public ResponseEntity<ExperienceEntity> updateExperience(
            @PathVariable Long id,
            @Valid @RequestBody ExperienceCreateRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        return ResponseEntity.ok(projectService.updateExperience(id, request));
    }

    @DeleteMapping("/experiences/{id}")
    public ResponseEntity<Map<String, String>> deleteExperience(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        projectService.deleteExperience(id);
        return ResponseEntity.ok(Map.of("message", "Experience #" + id + " deleted successfully."));
    }

    // ----------------- Education CRUD -----------------
    @GetMapping("/education")
    public ResponseEntity<List<EducationEntity>> getAdminEducation(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        return ResponseEntity.ok(projectService.getAllEducationAdmin());
    }

    @PostMapping("/education")
    public ResponseEntity<EducationEntity> createEducation(
            @Valid @RequestBody EducationCreateRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        return ResponseEntity.ok(projectService.createEducation(request));
    }

    @PutMapping("/education/{id}")
    public ResponseEntity<EducationEntity> updateEducation(
            @PathVariable Long id,
            @Valid @RequestBody EducationCreateRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        return ResponseEntity.ok(projectService.updateEducation(id, request));
    }

    @DeleteMapping("/education/{id}")
    public ResponseEntity<Map<String, String>> deleteEducation(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        adminAuthService.verifyOrThrow(authHeader);
        educationServiceDelete(id);
        return ResponseEntity.ok(Map.of("message", "Education #" + id + " deleted successfully."));
    }

    private void educationServiceDelete(Long id) {
        projectService.deleteEducation(id);
    }
}
