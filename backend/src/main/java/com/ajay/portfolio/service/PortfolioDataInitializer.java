package com.ajay.portfolio.service;

import com.ajay.portfolio.entity.EducationEntity;
import com.ajay.portfolio.entity.ExperienceEntity;
import com.ajay.portfolio.entity.ProjectEntity;
import com.ajay.portfolio.entity.SkillEntity;
import com.ajay.portfolio.repository.EducationRepository;
import com.ajay.portfolio.repository.ExperienceRepository;
import com.ajay.portfolio.repository.ProjectRepository;
import com.ajay.portfolio.repository.SkillRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PortfolioDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(PortfolioDataInitializer.class);

    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;
    private final com.ajay.portfolio.repository.ProfileRepository profileRepository;

    public PortfolioDataInitializer(
            ProjectRepository projectRepository,
            SkillRepository skillRepository,
            ExperienceRepository experienceRepository,
            EducationRepository educationRepository,
            com.ajay.portfolio.repository.ProfileRepository profileRepository) {
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.experienceRepository = experienceRepository;
        this.educationRepository = educationRepository;
        this.profileRepository = profileRepository;
    }

    @Override
    public void run(String... args) {
        try {
            seedProfile();
            seedSkills();
            seedProjects();
            seedExperiences();
            seedEducation();
            log.info("Portfolio database seed check completed.");
        } catch (Exception ex) {
            log.warn("Database initialization skipped or deferred: {}", ex.getMessage());
        }
    }

    private void seedProfile() {
        if (profileRepository.count() > 0) return;
        com.ajay.portfolio.entity.ProfileEntity profile = new com.ajay.portfolio.entity.ProfileEntity();
        profileRepository.save(profile);
    }

    private void seedSkills() {
        if (skillRepository.count() > 0) return;

        List<SkillEntity> skills = List.of(
                // Frontend
                new SkillEntity("Frontend", "Java Server Pages", ""),
                new SkillEntity("Frontend", "Servlets", ""),
                new SkillEntity("Frontend", "React Js", ""),
                new SkillEntity("Frontend", "Redux", ""),
                new SkillEntity("Frontend", "Next Js", ""),
                new SkillEntity("Frontend", "Tailwind CSS", ""),
                new SkillEntity("Frontend", "HTML", ""),
                new SkillEntity("Frontend", "CSS", ""),
                new SkillEntity("Frontend", "JavaScript", ""),
                new SkillEntity("Frontend", "Bootstrap", ""),
                new SkillEntity("Frontend", "Material UI", ""),
                new SkillEntity("Frontend", "TypeScript", ""),
                // Backend
                new SkillEntity("Backend", "Java", ""),
                new SkillEntity("Backend", "Spring Boot", ""),
                new SkillEntity("Backend", "Spring MVC", ""),
                new SkillEntity("Backend", "Spring Security", ""),
                new SkillEntity("Backend", "Hibernate", ""),
                new SkillEntity("Backend", "Node Js", ""),
                new SkillEntity("Backend", "Express Js", ""),
                new SkillEntity("Backend", "REST APIs", ""),
                new SkillEntity("Backend", "Authentication", ""),
                new SkillEntity("Backend", "Error Handling", ""),
                new SkillEntity("Backend", "Middleware", ""),
                // DevOps / Tools
                new SkillEntity("DevOps & Tools", "Git", ""),
                new SkillEntity("DevOps & Tools", "GitHub", ""),
                new SkillEntity("DevOps & Tools", "Docker", ""),
                new SkillEntity("DevOps & Tools", "Postman", ""),
                new SkillEntity("DevOps & Tools", "VS Code", ""),
                new SkillEntity("DevOps & Tools", "Eclipse", ""),
                new SkillEntity("DevOps & Tools", "Netlify", ""),
                new SkillEntity("DevOps & Tools", "Vercel", ""),
                new SkillEntity("DevOps & Tools", "Render", "")
        );
        skillRepository.saveAll(skills);
        log.info("Seeded {} skills into database.", skills.size());
    }

    private void seedProjects() {
        if (projectRepository.count() > 0) return;

        List<ProjectEntity> projects = List.of(
                new ProjectEntity(
                        "Eazy Logistics",
                        "May 2025 - Present",
                        "Eazy Logistics is a full-stack web application for smart logistics, property listing, and secure booking. Built with EJS, Bootstrap, JavaScript, and Mapbox on the frontend, and Node.js, Express.js, and MongoDB on the backend, it features social login, face authentication, real-time maps, property verification, premium PDF generation, OTP-based security, payment processing, and advanced admin controls to ensure trusted listings and secure transactions.",
                        "https://raw.githubusercontent.com/ajaysapkale136/Eazy-Logistics/main/Screenshot%202026-05-13%20122151.png",
                        "EJS, HTML5, CSS3, Bootstrap 5, JavaScript, Node.js, Express.js, MongoDB, Mongoose, Passport.js, Mapbox, Razorpay, Passkeys, WebAuthn",
                        "web app",
                        "https://github.com/ajaysapkale136/Eazy-Logistics.git",
                        "https://eazy-logistics.vercel.app/listings",
                        true
                ),
                new ProjectEntity(
                        "Wanderlust",
                        "Mar 2025 - May 2025",
                        "Wanderlust is a full-stack web application that replicates the core functionality of Airbnb. Built using Node.js, Express.js, and MongoDB, it allows users to create accounts, list accommodations with images, browse available properties, leave reviews and ratings, and manage their listings. Key features include user authentication with Passport.js, image uploads to Cloudinary, session management, and responsive UI with EJS templating.",
                        "https://raw.githubusercontent.com/ajaysapkale136/wanderlust-delta-project/main/w.jpg%20.jpeg",
                        "EJS, Bootstrap, JavaScript, Node Js, Express Js, MongoDb, Passport.js, Multer, Cloudinary",
                        "web app",
                        "https://github.com/ajaysapkale136/wanderlust-delta-project.git",
                        "https://wanderlust-delta-project-z412.onrender.com",
                        true
                ),
                new ProjectEntity(
                        "Spotify Clone",
                        "Jan 2025 - Feb 2025",
                        "Spotify clone with Play/Pause, Next/Previous, Volume Control, Seek Bar, and Playlist Management. The backend uses Node.js and Express.js to handle API requests and Spotify Web API integration.",
                        "https://raw.githubusercontent.com/ajaysapkale136/spotify-clone/main/Screenshot%202026-03-27%20224001.png",
                        "HTML, CSS, JavaScript, Spotify Web API, Responsive UI",
                        "web app",
                        "https://github.com/ajaysapkale136/spotify-clone.git",
                        "https://spotify-clone-git-main-ajaysapkale136s-projects.vercel.app/",
                        true
                ),
                new ProjectEntity(
                        "Random Color Generator",
                        "Nov 2024 - Dec 2024",
                        "Simple Random Color Generator using HTML, CSS, JavaScript for generating diverse color palettes with DOM events.",
                        "https://raw.githubusercontent.com/ajaysapkale136/Random-Color-Generator/main/Screenshot%202026-03-27%20142726.png",
                        "HTML, CSS, JavaScript, DOM Events, Responsive UI",
                        "frontend",
                        "https://github.com/ajaysapkale136/Random-Color-Generator.git",
                        "https://random-color-generator-weld-ten.vercel.app/",
                        true
                ),
                new ProjectEntity(
                        "Simon Says Game",
                        "Sep 2024 - Oct 2024",
                        "Classic Simon Says memory game built with JavaScript game logic and responsive CSS.",
                        "https://raw.githubusercontent.com/ajaysapkale136/Simon-Says-Game/main/Screenshot%202026-03-27%20135349.png",
                        "HTML, CSS, JavaScript, Game Logic, DOM Events",
                        "game",
                        "https://github.com/ajaysapkale136/Simon-Says-Game.git",
                        "https://simon-says-game-six-lime.vercel.app/",
                        true
                ),
                new ProjectEntity(
                        "Student Admission Form",
                        "Mar 2024 - Apr 2024",
                        "College website with integrated admission registration and form submission system.",
                        "https://raw.githubusercontent.com/ajaysapkale136/College-Website-Admission-Login-Ragisrtaion-Form/main/Screenshot%202026-03-27%20224903.png",
                        "HTML, CSS, Forms, Responsive Layout",
                        "frontend",
                        "https://github.com/ajaysapkale136/College-Website-Admission-Login-Ragisrtaion-Form.git",
                        "https://college-website-admission-l-git-0122dd-ajaysapkale136s-projects.vercel.app/#Courses",
                        true
                ),
                new ProjectEntity(
                        "Weather Forecast",
                        "Feb 2025 - Mar 2025",
                        "Weather Forecast Web App integrating external weather APIs for real-time temperature, humidity, wind, and conditions lookup.",
                        "https://raw.githubusercontent.com/ajaysapkale136/weather-detection-app/main/Screenshot%202026-03-26%20141820.png",
                        "React, Vanilla JS, Bootstrap, Tailwind, Weather API, Responsive UI",
                        "web app",
                        "https://github.com/ajaysapkale136/Weather-Detection-App.git",
                        "https://weather-detection-app-opal.vercel.app/",
                        true
                )
        );
        projectRepository.saveAll(projects);
        log.info("Seeded {} projects into database.", projects.size());
    }

    private void seedExperiences() {
        if (experienceRepository.count() > 0) return;

        List<ExperienceEntity> experiences = List.of(
                new ExperienceEntity(
                        "Growfinix",
                        "Backend Developer Intern",
                        "Aug 2025 - Oct 2025",
                        "Developed and maintained backend services using Node.js and Express.js. Designed RESTful APIs, handled server-side logic, and worked with databases to support scalable and secure application functionality.",
                        "API Integration, Backend Development, JavaScript, TypeScript, NodeJs, NextJs",
                        ""
                ),
                new ExperienceEntity(
                        "Edunet Foundation",
                        "AI & ML Intern",
                        "Jan 2025 - Mar 2025",
                        "Gained hands-on experience in Artificial Intelligence and Machine Learning, Worked on data analysis and basic model building tasks, Applied Python and visualization tools to solve problems.",
                        "Python, Machine Learning, Data Analysis, Data Visualization, AI Concepts, Problem Solving",
                        ""
                ),
                new ExperienceEntity(
                        "Edu-versity",
                        "Full Stack Web Developer Intern",
                        "Dec 2023 - Jan 2024",
                        "Developed full-stack web applications using React, Node.js, Express, and MongoDB. Built and integrated REST APIs, implemented responsive UI components.",
                        "ReactJS, ExpressJs, NodeJs, MongoDB, HTML, CSS, JavaScript",
                        ""
                )
        );
        experienceRepository.saveAll(experiences);
        log.info("Seeded {} experiences into database.", experiences.size());
    }

    private void seedEducation() {
        if (educationRepository.count() > 0) return;

        List<EducationEntity> education = List.of(
                new EducationEntity(
                        "GF's Godavari College of Engineering, Jalgaon",
                        "Bachelor of Technology - BTech, Computer Engineering",
                        "Sep 2022 - July 2026",
                        "(Pursuing)",
                        "Currently pursuing a Bachelor's degree in Computer Engineering. Coursework in Data Structures, Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, and Computer Networks."
                ),
                new EducationEntity(
                        "S.M. College, Muktainagar",
                        "HSC(XII), Science",
                        "Apr 2021 - Apr 2022",
                        "68.33%",
                        "Completed class 12 high school education studying Science stream."
                ),
                new EducationEntity(
                        "Sant Muktabai Madhyamik Vidyalaya, Muktainagar",
                        "SSC(X)",
                        "Apr 2019 - Apr 2020",
                        "66.00%",
                        "I completed my class 10 education at Sant Muktabai Madhyamik Vidhyalaya, Muktainagar."
                )
        );
        educationRepository.saveAll(education);
        log.info("Seeded {} education records into database.", education.size());
    }
}
