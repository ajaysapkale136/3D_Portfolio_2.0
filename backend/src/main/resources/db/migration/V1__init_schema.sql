-- Flyway Database Migration: V1__init_schema.sql
-- Compatible with MySQL 8.0+ and H2 Database

-- 1. Contact inquiries
CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(200) NOT NULL,
    phone_number VARCHAR(50),
    subject VARCHAR(250) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'NEW',
    client_ip VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Projects
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

-- 3. Skills
CREATE TABLE IF NOT EXISTS skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    image_url TEXT
);

-- 4. Work experiences
CREATE TABLE IF NOT EXISTS experiences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    date_range VARCHAR(100),
    description TEXT,
    skills TEXT,
    certificate_url VARCHAR(500)
);

-- 5. Education
CREATE TABLE IF NOT EXISTS education (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    school VARCHAR(250) NOT NULL,
    degree VARCHAR(250) NOT NULL,
    date_range VARCHAR(100),
    grade VARCHAR(50),
    description TEXT
);

-- 6. Bio / Profile information
CREATE TABLE IF NOT EXISTS profile_info (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    roles TEXT,
    description TEXT,
    github VARCHAR(500),
    resume VARCHAR(500),
    linkedin VARCHAR(500),
    twitter VARCHAR(500),
    insta VARCHAR(500),
    facebook VARCHAR(500)
);
