# Ajay Sapkale 3D Portfolio (Full-Stack + Spring AI)

A modern full-stack developer portfolio combining an interactive React + Three.js 3D user interface with a Spring Boot REST API, MySQL persistence, and an AI portfolio chatbot powered by Spring AI.

---

## Tech Stack

### Frontend
- **Framework:** React 18
- **3D Graphics:** Three.js, React Three Fiber, Drei
- **Styling:** Styled Components, Emotion, Material UI Icons
- **Animations:** Framer Motion
- **Contact Integration:** Dual-mode Spring Boot REST API + EmailJS fallback

### Backend
- **Framework:** Java 21, Spring Boot 3.5.x
- **AI Integration:** Spring AI (1.1.8) using `ChatClient` and OpenAI models
- **Persistence:** Spring Data JPA, Hibernate, MySQL 8.0+ (with H2 in-memory test profile)
- **Validation:** Jakarta Bean Validation
- **Architecture:** Clean layered architecture (`controller`, `service`, `dto`, `entity`, `repository`, `exception`, `config`)

---

## Project Structure

```text
3D-Portfolio-main/
├── backend/                               # Spring Boot + Spring AI Backend
│   ├── pom.xml                            # Maven dependencies & BOM
│   ├── .env.example                       # Backend environment template
│   └── src/
│       ├── main/
│       │   ├── java/com/ajay/portfolio/
│       │   │   ├── PortfolioApplication.java
│       │   │   ├── config/                # Web CORS & AI configuration
│       │   │   ├── controller/            # ChatController, ContactController, PortfolioController
│       │   │   ├── dto/                   # ChatRequest, ChatResponse, ContactRequest, etc.
│       │   │   ├── entity/                # ContactMessage, ProjectEntity, SkillEntity, etc.
│       │   │   ├── exception/             # Centralized GlobalExceptionHandler & error models
│       │   │   ├── repository/            # Spring Data JPA repositories
│       │   │   └── service/               # PortfolioChatService, PortfolioContextService, etc.
│       │   └── resources/
│       │       ├── application.yml        # Production/default environment configuration
│       │       ├── application-test.yml   # H2 test profile configuration
│       │       ├── schema.sql             # ANSI schema definition
│       │       └── schema-mysql.sql       # Standalone MySQL initialization script
│       └── test/                          # Unit & integration tests
│
├── public/                                # Public web assets
├── src/                                   # Existing React Frontend
│   ├── components/
│   │   ├── canvas/                        # Three.js Earth & Stars scenes
│   │   ├── cards/                         # Project, Experience, and Education cards
│   │   ├── chat/                          # Isolated Floating ChatWidget
│   │   └── sections/                      # Hero, Skills, Experience, Projects, Contact, Footer
│   ├── data/constants.js                  # Portfolio facts and fallback constants
│   ├── utils/api.js                       # Frontend REST API client
│   ├── App.js                             # Root React component
│   └── index.js                           # Frontend entrypoint
├── .env.example                           # Frontend environment template
├── package.json                           # Frontend scripts & dependencies
└── README.md
```

---

## Getting Started

### Prerequisites
- **Java:** JDK 21+ (`java -version`, `javac -version`)
- **Node.js:** v18+ (`node -v`, `npm -v`)
- **Maven:** 3.8+ (or Maven wrapper)
- **MySQL:** 8.0+ (running locally or remotely)

---

### 1. Database Setup (MySQL)

Create the database and schema:
```bash
mysql -u root -p < backend/src/main/resources/schema-mysql.sql
```
Alternatively, execute the following in your MySQL CLI or MySQL Workbench:
```sql
CREATE DATABASE IF NOT EXISTS portfolio;
```
The Spring Boot application automatically synchronizes the table schemas on startup via Hibernate (`ddl-auto: update`).

---

### 2. Backend Setup & Run

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Configure environment variables (or copy `backend/.env.example` to `backend/.env`):
   ```bash
   export DB_URL="jdbc:mysql://localhost:3306/portfolio?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
   export DB_USERNAME="root"
   export DB_PASSWORD="your_mysql_password"
   export OPENAI_API_KEY="your_openai_api_key"
   export OPENAI_MODEL="gpt-4o-mini"
   ```
3. Run the automated test suite:
   ```bash
   mvn test
   ```
4. Start the Spring Boot application (Port 8080):
   ```bash
   mvn spring-boot:run
   ```
   Or run the packaged JAR:
   ```bash
   java -jar target/portfolio-backend-0.0.1-SNAPSHOT.jar
   ```

---

### 3. Frontend Setup & Run

1. Install frontend dependencies from the repository root:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Configure frontend environment variables:
   ```bash
   cp .env.example .env
   ```
   Set your backend URL:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8080
   ```
3. Start the React development server (Port 3000):
   ```bash
   npm start
   ```
4. Build for production:
   ```bash
   npm run build
   ```

---

## API Endpoints Documentation

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/chat` | Send query to Spring AI portfolio chatbot | Public (Rate-limited) |
| `POST` | `/api/contact` | Submit and persist contact form message | Public (Rate-limited) |
| `GET` | `/api/health` | Healthcheck and service status | Public |
| `GET` | `/api/projects` | List all published projects (optional `?category=`) | Public |
| `GET` | `/api/projects/{id}` | Retrieve specific published project | Public |
| `GET` | `/api/skills` | List categorized skills | Public |
| `GET` | `/api/experience` | List work and internship experiences | Public |
| `GET` | `/api/education` | List academic details | Public |
| `GET` | `/api/bio` | Retrieve developer bio and social links | Public |

### Example Chat Request:
```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What projects has Ajay built using Spring Boot and Java?"}'
```

### Example Chat Response:
```json
{
  "reply": "Ajay has built several full-stack applications including this 3D portfolio powered by Spring Boot, Spring AI, and MySQL, as well as complex web applications like Eazy Logistics and Wanderlust.",
  "success": true,
  "timestamp": "2026-10-17T14:26:44"
}
```

---

## Security & Best Practices
- **No Secrets in Frontend:** The OpenAI API key and database credentials stay exclusively on the backend server.
- **Rate Limiting:** Chat messages and contact submissions are rate-limited per IP/email to protect against abuse and spam.
- **Input Validation:** All incoming requests are strictly validated with Jakarta Bean Validation (`@NotBlank`, `@Size(max = 1000)`).
- **Prompt Injection Defense:** Chat queries are treated as untrusted user input and grounded strictly against curated portfolio facts.
- **Safe Output Rendering:** Chat responses are rendered securely as text/markdown without inserting raw HTML.
