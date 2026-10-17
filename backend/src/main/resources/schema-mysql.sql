-- Standalone MySQL 8.0+ Database & Table Setup Script
-- Run directly in MySQL Workbench or MySQL CLI:
-- mysql -u root -p < schema-mysql.sql

CREATE DATABASE IF NOT EXISTS portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio;

CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(200) NOT NULL,
    subject VARCHAR(250) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'NEW',
    client_ip VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    date_range VARCHAR(100),
    description TEXT,
    image_url TEXT,
    tags TEXT,
    category VARCHAR(100),
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS experiences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    date_range VARCHAR(100),
    description TEXT,
    skills TEXT,
    certificate_url VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS education (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    school VARCHAR(250) NOT NULL,
    degree VARCHAR(250) NOT NULL,
    date_range VARCHAR(100),
    grade VARCHAR(50),
    description TEXT
);
