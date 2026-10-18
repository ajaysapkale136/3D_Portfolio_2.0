package com.ajay.portfolio.service;

import com.ajay.portfolio.dto.*;
import com.ajay.portfolio.entity.*;
import com.ajay.portfolio.exception.ResourceNotFoundException;
import com.ajay.portfolio.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ProjectService {

    private static final Logger log = LoggerFactory.getLogger(ProjectService.class);

    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;
    private final ProfileRepository profileRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final EmailNotificationService emailNotificationService;

    public ProjectService(
            ProjectRepository projectRepository,
            SkillRepository skillRepository,
            ExperienceRepository experienceRepository,
            EducationRepository educationRepository,
            ProfileRepository profileRepository,
            ContactMessageRepository contactMessageRepository,
            EmailNotificationService emailNotificationService) {
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.experienceRepository = experienceRepository;
        this.educationRepository = educationRepository;
        this.profileRepository = profileRepository;
        this.contactMessageRepository = contactMessageRepository;
        this.emailNotificationService = emailNotificationService;
    }

    public List<ProjectDto> getProjects(String category) {
        List<ProjectEntity> entities;
        if (category != null && !category.isBlank() && !"all".equalsIgnoreCase(category)) {
            entities = projectRepository.findByPublishedTrueAndCategoryIgnoreCaseOrderByIdAsc(category);
        } else {
            entities = projectRepository.findByPublishedTrueOrderByIdAsc();
        }

        return entities.stream().map(this::toProjectDto).collect(Collectors.toList());
    }

    public List<ProjectEntity> getAllProjectsAdmin() {
        return projectRepository.findAll();
    }

    public PagedResponse<ProjectEntity> getPagedProjects(int page, int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(Math.max(0, page), Math.max(1, Math.min(size, 100)));
        org.springframework.data.domain.Page<ProjectEntity> result = projectRepository.findAll(pageable);
        return new PagedResponse<>(
                result.getContent(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.isLast()
        );
    }

    public ProjectDto getProjectById(Long id) {
        return projectRepository.findByIdAndPublishedTrue(id)
                .map(this::toProjectDto)
                .orElseThrow(() -> new ResourceNotFoundException("Project with id " + id + " not found"));
    }

    @Transactional
    public ProjectEntity createProject(ProjectCreateRequest req) {
        ProjectEntity project = new ProjectEntity(
                req.title(),
                req.dateRange() != null ? req.dateRange() : "",
                req.description() != null ? req.description() : "",
                req.imageUrl() != null ? req.imageUrl() : "",
                req.tags() != null ? req.tags() : "",
                req.category() != null ? req.category() : "fullstack",
                req.githubUrl() != null ? req.githubUrl() : "",
                req.liveUrl() != null ? req.liveUrl() : "",
                req.published() == null || req.published()
        );
        return projectRepository.save(project);
    }

    @Transactional
    public ProjectEntity updateProject(Long id, ProjectCreateRequest req) {
        ProjectEntity project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        project.setTitle(req.title());
        if (req.dateRange() != null) project.setDateRange(req.dateRange());
        if (req.description() != null) project.setDescription(req.description());
        if (req.imageUrl() != null) project.setImageUrl(req.imageUrl());
        if (req.tags() != null) project.setTags(req.tags());
        if (req.category() != null) project.setCategory(req.category());
        if (req.githubUrl() != null) project.setGithubUrl(req.githubUrl());
        if (req.liveUrl() != null) project.setLiveUrl(req.liveUrl());
        if (req.published() != null) project.setPublished(req.published());

        return projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

    public List<SkillGroupDto> getSkills() {
        List<SkillEntity> skills = skillRepository.findAllByOrderByIdAsc();
        Map<String, List<SkillGroupDto.SkillItemDto>> grouped = new LinkedHashMap<>();

        for (SkillEntity skill : skills) {
            grouped.computeIfAbsent(skill.getCategory(), k -> new ArrayList<>())
                    .add(new SkillGroupDto.SkillItemDto(skill.getName(), skill.getImageUrl()));
        }

        return grouped.entrySet().stream()
                .map(entry -> new SkillGroupDto(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    public List<SkillEntity> getAllSkillsAdmin() {
        return skillRepository.findAllByOrderByIdAsc();
    }

    @Transactional
    public SkillEntity createSkill(SkillCreateRequest req) {
        SkillEntity skill = new SkillEntity(req.category().trim(), req.name().trim(), req.imageUrl() != null ? req.imageUrl().trim() : "");
        return skillRepository.save(skill);
    }

    @Transactional
    public void deleteSkill(Long id) {
        if (!skillRepository.existsById(id)) {
            throw new ResourceNotFoundException("Skill not found with id: " + id);
        }
        skillRepository.deleteById(id);
    }

    public List<ExperienceDto> getExperiences() {
        return experienceRepository.findAllByOrderByIdAsc().stream()
                .map(this::toExperienceDto)
                .collect(Collectors.toList());
    }

    public List<ExperienceEntity> getAllExperiencesAdmin() {
        return experienceRepository.findAllByOrderByIdAsc();
    }

    @Transactional
    public ExperienceEntity createExperience(ExperienceCreateRequest req) {
        ExperienceEntity entity = new ExperienceEntity(
                req.company().trim(),
                req.role().trim(),
                req.dateRange() != null ? req.dateRange() : "",
                req.description() != null ? req.description() : "",
                req.skills() != null ? req.skills() : "",
                req.certificateUrl() != null ? req.certificateUrl() : ""
        );
        return experienceRepository.save(entity);
    }

    @Transactional
    public ExperienceEntity updateExperience(Long id, ExperienceCreateRequest req) {
        ExperienceEntity entity = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found with id: " + id));
        entity.setCompany(req.company().trim());
        entity.setRole(req.role().trim());
        if (req.dateRange() != null) entity.setDateRange(req.dateRange());
        if (req.description() != null) entity.setDescription(req.description());
        if (req.skills() != null) entity.setSkills(req.skills());
        if (req.certificateUrl() != null) entity.setCertificateUrl(req.certificateUrl());
        return experienceRepository.save(entity);
    }

    @Transactional
    public void deleteExperience(Long id) {
        if (!experienceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Experience not found with id: " + id);
        }
        experienceRepository.deleteById(id);
    }

    public List<EducationDto> getEducation() {
        return educationRepository.findAllByOrderByIdAsc().stream()
                .map(this::toEducationDto)
                .collect(Collectors.toList());
    }

    public List<EducationEntity> getAllEducationAdmin() {
        return educationRepository.findAllByOrderByIdAsc();
    }

    @Transactional
    public EducationEntity createEducation(EducationCreateRequest req) {
        EducationEntity entity = new EducationEntity(
                req.school().trim(),
                req.degree().trim(),
                req.dateRange() != null ? req.dateRange() : "",
                req.grade() != null ? req.grade() : "",
                req.description() != null ? req.description() : ""
        );
        return educationRepository.save(entity);
    }

    @Transactional
    public EducationEntity updateEducation(Long id, EducationCreateRequest req) {
        EducationEntity entity = educationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Education not found with id: " + id));
        entity.setSchool(req.school().trim());
        entity.setDegree(req.degree().trim());
        if (req.dateRange() != null) entity.setDateRange(req.dateRange());
        if (req.grade() != null) entity.setGrade(req.grade());
        if (req.description() != null) entity.setDescription(req.description());
        return educationRepository.save(entity);
    }

    @Transactional
    public void deleteEducation(Long id) {
        if (!educationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Education not found with id: " + id);
        }
        educationRepository.deleteById(id);
    }

    public BioDto getBio() {
        ProfileEntity profile = profileRepository.findFirstByOrderByIdAsc().orElseGet(() -> {
            ProfileEntity defaultProfile = new ProfileEntity();
            return profileRepository.save(defaultProfile);
        });

        List<String> rolesList = Arrays.stream(profile.getRoles().split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        return new BioDto(
                profile.getName(),
                rolesList,
                profile.getDescription(),
                profile.getGithub(),
                profile.getResume(),
                profile.getLinkedin(),
                profile.getTwitter(),
                profile.getInsta(),
                profile.getFacebook()
        );
    }

    @Transactional
    public BioDto updateBio(BioUpdateRequest req) {
        ProfileEntity profile = profileRepository.findFirstByOrderByIdAsc().orElseGet(ProfileEntity::new);
        profile.setName(req.name());
        if (req.roles() != null) profile.setRoles(req.roles());
        if (req.description() != null) profile.setDescription(req.description());
        if (req.github() != null) profile.setGithub(req.github());
        if (req.resume() != null) profile.setResume(req.resume());
        if (req.linkedin() != null) profile.setLinkedin(req.linkedin());
        if (req.twitter() != null) profile.setTwitter(req.twitter());
        if (req.insta() != null) profile.setInsta(req.insta());
        if (req.facebook() != null) profile.setFacebook(req.facebook());

        ProfileEntity saved = profileRepository.save(profile);

        List<String> rolesList = Arrays.stream(saved.getRoles().split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        return new BioDto(
                saved.getName(),
                rolesList,
                saved.getDescription(),
                saved.getGithub(),
                saved.getResume(),
                saved.getLinkedin(),
                saved.getTwitter(),
                saved.getInsta(),
                saved.getFacebook()
        );
    }

    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc();
    }

    public PagedResponse<ContactMessage> getPagedMessages(int page, int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(Math.max(0, page), Math.max(1, Math.min(size, 100)));
        org.springframework.data.domain.Page<ContactMessage> result = contactMessageRepository.findAllByOrderByCreatedAtDesc(pageable);
        return new PagedResponse<>(
                result.getContent(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.isLast()
        );
    }

    @Transactional
    public ContactMessage updateMessageStatus(Long id, String status) {
        ContactMessage msg = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with id: " + id));
        String previousStatus = msg.getStatus();
        msg.setStatus(status);
        ContactMessage saved = contactMessageRepository.save(msg);

        // When Ajay marks an inquiry as READ, send an automated notification to the sender
        if ("READ".equalsIgnoreCase(status) && !"READ".equalsIgnoreCase(previousStatus)) {
            try {
                emailNotificationService.sendMessageReadReceipt(saved);
            } catch (Exception ex) {
                log.warn("Could not dispatch visitor read receipt email for message #{}: {}", id, ex.getMessage());
            }
        }

        return saved;
    }

    @Transactional
    public void deleteMessage(Long id) {
        if (!contactMessageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Message not found with id: " + id);
        }
        contactMessageRepository.deleteById(id);
    }

    public DashboardStatsDto getStats() {
        long totalMessages = contactMessageRepository.count();
        long newMessages = contactMessageRepository.findAll().stream()
                .filter(m -> "NEW".equalsIgnoreCase(m.getStatus()))
                .count();
        long totalProjects = projectRepository.count();
        long totalSkills = skillRepository.count();

        return new DashboardStatsDto(
                totalMessages,
                newMessages,
                totalProjects,
                totalSkills,
                "UP",
                java.time.LocalDateTime.now().toString()
        );
    }

    private ProjectDto toProjectDto(ProjectEntity p) {
        List<String> tagsList = Collections.emptyList();
        if (p.getTags() != null && !p.getTags().isBlank()) {
            tagsList = Arrays.stream(p.getTags().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        }

        return new ProjectDto(
                p.getId(),
                p.getTitle(),
                p.getDateRange(),
                p.getDescription(),
                p.getImageUrl(),
                tagsList,
                p.getCategory(),
                p.getGithubUrl(),
                p.getLiveUrl()
        );
    }

    private ExperienceDto toExperienceDto(ExperienceEntity e) {
        List<String> skillsList = Collections.emptyList();
        if (e.getSkills() != null && !e.getSkills().isBlank()) {
            skillsList = Arrays.stream(e.getSkills().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        }

        return new ExperienceDto(
                e.getId(),
                "",
                e.getRole(),
                e.getCompany(),
                e.getDateRange(),
                e.getDescription(),
                skillsList,
                e.getCertificateUrl()
        );
    }

    private EducationDto toEducationDto(EducationEntity e) {
        return new EducationDto(
                e.getId(),
                "",
                e.getSchool(),
                e.getDateRange(),
                e.getGrade(),
                e.getDescription(),
                e.getDegree()
        );
    }
}
