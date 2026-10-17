package com.ajay.portfolio.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "profile_info")
public class ProfileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name = "Ajay Sapkale";

    @Column(columnDefinition = "TEXT")
    private String roles = "Java Full Stack Developer, Full Stack Developer, MERN Developer, Frontend Developer, Backend Developer";

    @Column(columnDefinition = "TEXT")
    private String description = "I am a motivated and versatile individual, always eager to take on new challenges. With a passion for learning I am dedicated to delivering high-quality results. With a positive attitude and a growth mindset, I am ready to make a meaningful contribution and achieve great things.";

    @Column(length = 500)
    private String github = "https://github.com/ajaysapkale136";

    @Column(length = 500)
    private String resume = "https://drive.google.com/file/d/1odgxEt0eeU7uhBg_VZsNFWzq1PjEY-Cr/view?usp=sharing";

    @Column(length = 500)
    private String linkedin = "https://www.linkedin.com/in/ajay-sapkale-5352782a2?utm_source=share_via&utm_content=profile&utm_medium=member_android";

    @Column(length = 500)
    private String twitter = "";

    @Column(length = 500)
    private String insta = "";

    @Column(length = 500)
    private String facebook = "";

    public ProfileEntity() {
    }

    public ProfileEntity(String name, String roles, String description, String github, String resume, String linkedin) {
        this.name = name;
        this.roles = roles;
        this.description = description;
        this.github = github;
        this.resume = resume;
        this.linkedin = linkedin;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getGithub() {
        return github;
    }

    public void setGithub(String github) {
        this.github = github;
    }

    public String getResume() {
        return resume;
    }

    public void setResume(String resume) {
        this.resume = resume;
    }

    public String getLinkedin() {
        return linkedin;
    }

    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }

    public String getTwitter() {
        return twitter;
    }

    public void setTwitter(String twitter) {
        this.twitter = twitter;
    }

    public String getInsta() {
        return insta;
    }

    public void setInsta(String insta) {
        this.insta = insta;
    }

    public String getFacebook() {
        return facebook;
    }

    public void setFacebook(String facebook) {
        this.facebook = facebook;
    }
}
