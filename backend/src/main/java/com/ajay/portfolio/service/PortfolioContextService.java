package com.ajay.portfolio.service;

import com.ajay.portfolio.entity.ProfileEntity;
import com.ajay.portfolio.repository.*;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class PortfolioContextService {

    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;
    private final ProfileRepository profileRepository;

    public PortfolioContextService(
            ProjectRepository projectRepository,
            SkillRepository skillRepository,
            ExperienceRepository experienceRepository,
            EducationRepository educationRepository,
            ProfileRepository profileRepository) {
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.experienceRepository = experienceRepository;
        this.educationRepository = educationRepository;
        this.profileRepository = profileRepository;
    }

    public String buildContext() {
        StringBuilder sb = new StringBuilder();

        ProfileEntity profile = profileRepository.findFirstByOrderByIdAsc().orElse(null);

        sb.append("=== DEVELOPER BIO ===\n");
        sb.append("Name: ").append(profile != null ? profile.getName() : "Ajay Sapkale").append("\n");
        sb.append("Roles: ").append(profile != null ? profile.getRoles() : "Java Full Stack Developer, Full Stack Developer").append("\n");
        sb.append("Description: ").append(profile != null ? profile.getDescription() : "Motivated Java full-stack engineer").append("\n");
        sb.append("GitHub: ").append(profile != null ? profile.getGithub() : "https://github.com/ajaysapkale136").append("\n");
        sb.append("LinkedIn: ").append(profile != null ? profile.getLinkedin() : "https://www.linkedin.com/in/ajay-sapkale-5352782a2").append("\n");
        sb.append("Resume: ").append(profile != null ? profile.getResume() : "Available on portfolio").append("\n\n");

        sb.append("=== TECHNICAL SKILLS ===\n");
        var skills = skillRepository.findAllByOrderByIdAsc();
        if (!skills.isEmpty()) {
            var grouped = skills.stream()
                    .collect(Collectors.groupingBy(s -> s.getCategory(), Collectors.mapping(s -> s.getName(), Collectors.joining(", "))));
            grouped.forEach((category, skillList) -> sb.append("- ").append(category).append(": ").append(skillList).append("\n"));
        } else {
            sb.append("- Backend: Java, Spring Boot, Spring MVC, Spring Security, Hibernate, Node.js, Express.js, REST APIs.\n");
            sb.append("- Frontend: React.js, Redux, Next.js, JavaScript, TypeScript, Three.js, Tailwind CSS.\n");
            sb.append("- Databases: MySQL, PostgreSQL, MongoDB, Spring Data JPA.\n");
        }
        sb.append("\n");

        sb.append("=== WORK & INTERNSHIP EXPERIENCE ===\n");
        var experiences = experienceRepository.findAllByOrderByIdAsc();
        if (!experiences.isEmpty()) {
            for (var exp : experiences) {
                sb.append("- ").append(exp.getRole()).append(" at ").append(exp.getCompany())
                        .append(" (").append(exp.getDateRange()).append("):\n")
                        .append("  ").append(exp.getDescription()).append("\n");
                if (exp.getSkills() != null && !exp.getSkills().isBlank()) {
                    sb.append("  Skills used: ").append(exp.getSkills()).append("\n");
                }
            }
        }
        sb.append("\n");

        sb.append("=== EDUCATION ===\n");
        var educationList = educationRepository.findAllByOrderByIdAsc();
        if (!educationList.isEmpty()) {
            for (var edu : educationList) {
                sb.append("- ").append(edu.getDegree()).append(" from ").append(edu.getSchool())
                        .append(" (").append(edu.getDateRange()).append(", ").append(edu.getGrade()).append("):\n")
                        .append("  ").append(edu.getDescription()).append("\n");
            }
        }
        sb.append("\n");

        sb.append("=== FEATURED PROJECTS ===\n");
        var projects = projectRepository.findByPublishedTrueOrderByIdAsc();
        if (!projects.isEmpty()) {
            for (var proj : projects) {
                sb.append("- ").append(proj.getTitle()).append(" (").append(proj.getCategory()).append("):\n");
                sb.append("  Description: ").append(proj.getDescription()).append("\n");
                sb.append("  Tech Stack: ").append(proj.getTags()).append("\n");
                if (proj.getGithubUrl() != null) sb.append("  GitHub: ").append(proj.getGithubUrl()).append("\n");
                if (proj.getLiveUrl() != null) sb.append("  Live Demo: ").append(proj.getLiveUrl()).append("\n");
            }
        }

        return sb.toString();
    }
}
