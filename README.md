# 🚀 Ajay Sapkale - 3D Developer Portfolio & Spring AI Backend

> A high-performance, enterprise-grade full-stack developer portfolio combining an immersive **React 18 + Three.js** interactive 3D frontend with a robust **Java 21 + Spring Boot 3** RESTful backend, **Spring AI** intelligent grounded chat assistant, **MySQL** persistence, and an **Email-based OTP 2-Factor Authentication** system.

---

## 🏗️ Architecture Overview

The application is structured following clean architectural principles:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT LAYER (React 18)                         │
│  • Three.js Interactive 3D Canvas (Earth, Stars, OrbitControls)             │
│  • Framer Motion & Styled Components Glassmorphic UI                        │
│  • Resilient Multi-Platform Chat Assistant Widget                           │
│  • Protected Admin Control Center (Email ID + 6-Digit OTP 2FA)              │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / JSON REST APIs
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BACKEND & SERVERLESS RUNTIMES                          │
│                                                                             │
│  [Option A: Java 21 / Spring Boot 3 Engine - Port 8080]                     │
│  ├── Security Layer: Email OTP 2FA, Salted SHA-256, Bearer Token Filter     │
│  ├── Rate Limiters: IP & Email Sliding Window Throttling                    │
│  ├── Controllers: AuthController, AdminController, ChatController, Contact   │
│  ├── Services: PortfolioChatService, ProjectService, EmailNotification      │
│  ├── Spring AI: Grounded ChatClient against dynamic PortfolioContextService │
│  ├── Flyway: Automated Database Schema Migrations                           │
│  └── Persistence: Spring Data JPA + Hibernate + HikariCP Connection Pool    │
│                                                                             │
│  [Option B: Vercel Edge / Serverless Functions - Cloud Native /api/*]       │
│  ├── /api/auth/send-otp.js (Nodemailer Gmail SMTP + Salted SHA-256)         │
│  ├── /api/auth/verify-otp.js (Timing-Safe OTP Validation & Bearer Tokens)   │
│  ├── /api/chat.js (Grounded Semantic Portfolio AI Intelligence)             │
│  └── /api/contact.js (Visitor Inquiries & Read Receipts)                    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ JDBC / TLS
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE & STORAGE LAYER                          │
│  • Primary: Cloud MySQL 8.0+ / Aiven Cloud Managed Database                 │
│  • Fallback / Local Dev: Embedded H2 Database (MySQL compatibility mode)    │
│  • Mail Transport: Live Gmail SMTP (TLS Port 587)                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack & Personal Implementation

### 1. Backend & Architecture (What I Personally Engineered)
- **Java 21 & Spring Boot 3.5.x:** Designed a modular, maintainable layered backend with strict separation of concerns across `controller`, `service`, `repository`, `dto`, `entity`, `exception`, and `security` packages.
- **Spring AI (`ChatClient`):** Integrated Spring AI using conversational grounding. The assistant queries `PortfolioContextService` to construct system prompts with real-time portfolio facts, preventing hallucinations.
- **Email ID + OTP 2-Factor Authentication:**
  - Eliminated static/default passwords (`admin/admin123`).
  - Cryptographically secure 6-digit OTP generation using `java.security.SecureRandom`.
  - Passwords and OTPs salted and hashed using **SHA-256** and verified with **`MessageDigest.isEqual`** (constant-time comparison) to prevent timing attacks.
  - Multi-tier sliding window rate limiting (max 3 OTP requests / 10 minutes, max 5 failed attempts per OTP before permanent invalidation, IP lockout on 10 failures / 15 minutes).
  - Real-time automated email delivery via `JavaMailSender` and SMTP.
- **Data Validation & Error Handling:** Centralized `@RestControllerAdvice` (`GlobalExceptionHandler`) handling RFC 7807 problem details, Bean Validation errors, and custom exceptions (`UnauthorizedException`, `RateLimitExceededException`, `ResourceNotFoundException`).
- **Database Migrations & Pagination:** Added **Flyway** migration scripts (`V1__init_schema.sql`) and implemented `Pageable` endpoints (`/api/admin/messages/paged`, `/api/admin/projects/paged`) for growing datasets.

### 2. Frontend & User Experience
- **React 18 & Three.js:** Developed interactive 3D Earth and Starfield canvases utilizing `@react-three/fiber` and `@react-three/drei`.
- **Pixel-Perfect Alignment:** Enforced rigid grid/card container layout (`align-items: stretch`, fixed 500px card heights, 2-row tag clamps, uniform image dimensions) ensuring uniform rendering across devices.
- **Admin Control Center:** Implemented glassmorphic Admin Portal featuring live visitor inquiry triage, real-time message read receipts, dynamic project publishing, and resume link updates.

---

## 🔒 Security Architecture Highlights

| Security Feature | Implementation Mechanism | Benefit |
|---|---|---|
| **Admin Authentication** | Email ID + One-Time Password (OTP) 2FA | No static passwords in code or database; immune to credential stuffing |
| **OTP Cryptography** | `SecureRandom` + UUID Salt + SHA-256 | Unpredictable, single-use, 10-minute expiration |
| **Timing Attack Defense** | `MessageDigest.isEqual()` | Constant-time string verification |
| **Rate Limiting** | Sliding window counter per IP & Email | Protects against brute-force attacks and email spamming |
| **API Authorization** | Bearer token verification on all `/api/admin/**` endpoints | Reject unauthenticated requests with HTTP 401 Unauthorized |
| **Input Sanitization** | Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Size`) | Prevents SQL injection, XSS, and buffer overflows |
| **CORS Policy** | Restricts `Access-Control-Allow-Origin` to configured domains | Prevents cross-origin unauthorized resource access |
| **Secret Isolation** | Environment variables (`.env`, `.env.example`) | Zero credentials or API keys exposed in frontend code |

---

## 📡 API Catalog

### Public Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/chat` | Query the grounded Spring AI assistant | No (Rate-limited) |
| `POST` | `/api/contact` | Submit contact inquiry & trigger email notification | No (Rate-limited) |
| `GET` | `/api/health` | Healthcheck and service uptime | No |
| `GET` | `/api/projects` | Fetch published projects (`?category=` filter supported) | No |
| `GET` | `/api/projects/{id}` | Fetch individual project details | No |
| `GET` | `/api/skills` | List categorized skills | No |
| `GET` | `/api/experience` | List professional work experience | No |
| `GET` | `/api/education` | List academic background | No |
| `GET` | `/api/bio` | Retrieve developer bio and social links | No |

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/send-otp` | Dispatch 6-digit OTP to admin email | No (Rate-limited) |
| `POST` | `/api/auth/verify-otp` | Verify 6-digit OTP and receive Bearer session token | No (Rate-limited) |
| `POST` | `/api/auth/login` | Unified authentication endpoint | No |
| `GET` | `/api/auth/verify` | Verify active Bearer session token validity | Optional (Bearer token) |
| `POST` | `/api/auth/logout` | Invalidate active Bearer session token | Optional (Bearer token) |

### Protected Admin Endpoints (`Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/stats` | Dashboard statistics (total messages, projects, skills, system status) |
| `GET` | `/api/admin/messages` | List all visitor contact messages (sorted newest first) |
| `GET` | `/api/admin/messages/paged` | Paginated messages (`?page=0&size=10`) |
| `PUT` | `/api/admin/messages/{id}/status` | Update message status (`NEW` -> `READ` sends visitor receipt) |
| `DELETE` | `/api/admin/messages/{id}` | Permanently delete visitor message |
| `GET` | `/api/admin/projects` | List all projects (including unpublished drafts) |
| `GET` | `/api/admin/projects/paged` | Paginated projects (`?page=0&size=10`) |
| `POST` | `/api/admin/projects` | Create and publish new project |
| `PUT` | `/api/admin/projects/{id}` | Update existing project details |
| `DELETE` | `/api/admin/projects/{id}` | Delete project |
| `PUT` | `/api/admin/bio` | Update resume link, bio, and roles |

---

## 🧪 Automated Testing

The backend includes a comprehensive JUnit 5 and Spring Boot MockMvc test suite with **100% test pass rate** (18 tests executed and passing):

```bash
cd backend
mvn test
```

### Verified Test Scenarios:
1. **Security Isolation:** Unauthenticated requests to `/api/admin/**` are strictly rejected with HTTP 401 Unauthorized.
2. **OTP Dispatch Protection:** Requesting an OTP for an unauthorized email address returns HTTP 401 Unauthorized.
3. **OTP Validation:** Malformed or non-6-digit OTPs return HTTP 400 Bad Request; incorrect OTPs return HTTP 401 Unauthorized.
4. **End-to-End OTP Login:** Dispatching OTP, verifying valid code, acquiring session token, and accessing protected endpoints.
5. **Session Expiry & Logout:** Tokens invalidated via `/api/auth/logout` can no longer access protected endpoints.
6. **Chatbot Validation:** Empty messages and payloads exceeding 1000 characters are rejected with HTTP 400 Bad Request.
7. **Contact Form Validation:** Blank names, invalid emails, and empty messages are rejected with HTTP 400 Bad Request.

---

## 💻 Local Setup & Development

### Prerequisites
- **Java:** JDK 21+ (`java -version`)
- **Node.js:** v18+ (`node -v`)
- **Maven:** 3.8+ (or included Maven wrapper)
- **MySQL:** 8.0+ (Optional: Embedded H2 database runs automatically if MySQL is not detected)

### 1. Clone & Configure Environment
```bash
git clone https://github.com/ajaysapkale136/3D_Portfolio_2.0.git
cd 3D_Portfolio_2.0
cp .env.example .env
```

### 2. Run Backend (Port 8080)
```bash
cd backend
mvn spring-boot:run
```
*(Or double-click `start-backend.bat` on Windows)*

### 3. Run Frontend (Port 3000)
```bash
npm install --legacy-peer-deps
npm start
```
*(Or double-click `start-frontend.bat` on Windows)*

Visit **`http://localhost:3000`** in your browser.

---

## 👨‍💻 Recruiter & Visitor Demo Guide

- **Public Features:** Explore interactive 3D models, review technical skills and verified project repositories, test the conversational Spring AI assistant, or submit a message via the Contact section.
- **Admin Portal Demo:** To prevent unauthorized tampering with live portfolio data, administrative access requires One-Time Password (OTP) verification sent to Ajay's registered email. Evaluators interested in an administrative walkthrough or live code discussion are invited to connect directly via [LinkedIn](https://www.linkedin.com/in/ajay-sapkale-5352782a2) or email at [ajaysapkale136@gmail.com](mailto:ajaysapkale136@gmail.com).

---

## 📜 License
This project is open-source under the MIT License.
