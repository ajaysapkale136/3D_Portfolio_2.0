package com.ajay.portfolio.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "education")
public class EducationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 250)
    private String school;

    @Column(nullable = false, length = 250)
    private String degree;

    @Column(name = "date_range", length = 100)
    private String dateRange;

    @Column(length = 50)
    private String grade;

    @Column(columnDefinition = "TEXT")
    private String description;

    public EducationEntity() {
    }

    public EducationEntity(String school, String degree, String dateRange, String grade, String description) {
        this.school = school;
        this.degree = degree;
        this.dateRange = dateRange;
        this.grade = grade;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSchool() {
        return school;
    }

    public void setSchool(String school) {
        this.school = school;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getDateRange() {
        return dateRange;
    }

    public void setDateRange(String dateRange) {
        this.dateRange = dateRange;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
