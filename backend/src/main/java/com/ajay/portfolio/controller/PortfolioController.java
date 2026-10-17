package com.ajay.portfolio.controller;

import com.ajay.portfolio.dto.*;
import com.ajay.portfolio.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PortfolioController {

    private final ProjectService projectService;

    public PortfolioController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "3D Portfolio Spring Boot API",
                "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectDto>> getProjects(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(projectService.getProjects(category));
    }

    @GetMapping("/projects/{id}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @GetMapping("/skills")
    public ResponseEntity<List<SkillGroupDto>> getSkills() {
        return ResponseEntity.ok(projectService.getSkills());
    }

    @GetMapping("/experience")
    public ResponseEntity<List<ExperienceDto>> getExperiences() {
        return ResponseEntity.ok(projectService.getExperiences());
    }

    @GetMapping("/education")
    public ResponseEntity<List<EducationDto>> getEducation() {
        return ResponseEntity.ok(projectService.getEducation());
    }

    @GetMapping("/bio")
    public ResponseEntity<BioDto> getBio() {
        return ResponseEntity.ok(projectService.getBio());
    }
}
