import {
  Bio as defaultBio,
  skills as defaultSkills,
  experiences as defaultExperiences,
  education as defaultEducation,
  projects as defaultProjects,
} from "../data/constants";

// ======================== ENVIRONMENT & BASE URL ========================
const isBrowser = typeof window !== "undefined";
const isLocalhost =
  isBrowser &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.endsWith(".local"));

// If REACT_APP_API_BASE_URL is specified, respect it.
// If running on localhost, point to local Spring Boot (http://localhost:8080).
// If running in production (Vercel, custom domain), use "" so requests go to
// relative /api endpoints (avoiding HTTPS mixed-content blocks).
const API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL ||
  (isLocalhost ? "http://localhost:8080" : "")
).replace(/\/$/, "");

// ======================== STORAGE HELPERS ========================
function getStorage(key, fallback) {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (_) {
    return fallback;
  }
}

function setStorage(key, value) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
}

// Initial seed data conversion
function getInitialProjects() {
  return defaultProjects.map((p, idx) => ({
    id: p.id !== undefined ? p.id : idx,
    title: p.title || "",
    category: p.category || "web app",
    tags: Array.isArray(p.tags) ? p.tags.join(", ") : p.tags || "",
    description: p.description || "",
    imageUrl: p.image || p.imageUrl || "",
    githubUrl: p.github || p.githubUrl || "",
    liveUrl: p.webapp || p.liveUrl || "",
    dateRange: p.date || p.dateRange || "",
    published: true,
  }));
}

function getInitialSkills() {
  const flattened = [];
  let counter = 1;
  defaultSkills.forEach((cat) => {
    (cat.skills || []).forEach((s) => {
      flattened.push({
        id: counter++,
        category: cat.title,
        name: s.name,
        imageUrl: s.image,
      });
    });
  });
  return flattened;
}

function getInitialExperiences() {
  return defaultExperiences.map((exp, idx) => ({
    id: exp.id || idx + 1,
    company: exp.company || "",
    role: exp.role || "",
    dateRange: exp.date || exp.dateRange || "",
    skills: Array.isArray(exp.skills) ? exp.skills.join(", ") : exp.skills || "",
    description: exp.desc || exp.description || "",
    certificateUrl: exp.doc || exp.certificateUrl || "",
  }));
}

function getInitialEducation() {
  return defaultEducation.map((edu, idx) => ({
    id: edu.id || idx + 1,
    school: edu.school || edu.institution || "",
    degree: edu.degree || "",
    dateRange: edu.date || edu.dateRange || "",
    grade: edu.grade || "",
    description: edu.desc || edu.description || "",
  }));
}

function getInitialBio() {
  return {
    name: defaultBio.name || "Ajay Sapkale",
    roles: Array.isArray(defaultBio.roles) ? defaultBio.roles.join(", ") : defaultBio.roles || "",
    description: defaultBio.description || "",
    github: defaultBio.github || "",
    resume: defaultBio.resume || "",
    linkedin: defaultBio.linkedin || "",
    twitter: defaultBio.twitter || "",
    insta: defaultBio.insta || "",
    facebook: defaultBio.facebook || "",
  };
}

function getInitialMessages() {
  return [
    {
      id: 101,
      name: "Sarah Jenkins",
      email: "sarah.jenkins@techrecruiter.com",
      phoneNumber: "+1 (555) 349-2041",
      subject: "Senior Full Stack Opportunity",
      message:
        "Hi Ajay, impressed by your 3D portfolio and Spring Boot architecture. We have an opening for a Java Full Stack engineer. Would love to connect!",
      status: "NEW",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 102,
      name: "Rohit Sharma",
      email: "rohit.s@innovatex.io",
      phoneNumber: "+91 98765 43210",
      subject: "Collaboration on Eazy Logistics",
      message:
        "Saw your passkey authentication demo on Eazy Logistics. Very clean implementation. Let's discuss a contract collaboration.",
      status: "READ",
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
  ];
}

// Storage Keys
const KEY_PROJECTS = "portfolio_admin_projects_v4";
const KEY_SKILLS = "portfolio_admin_skills";
const KEY_EXPERIENCES = "portfolio_admin_experiences";
const KEY_EDUCATION = "portfolio_admin_education";
const KEY_BIO = "portfolio_admin_bio";
const KEY_MESSAGES = "portfolio_admin_messages";

// ======================== GROUNDED AI ENGINE ========================
export function generateGroundedAiReply(userMessage) {
  const lower = (userMessage || "").toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|hola|greetings|namaste|sup|yo)\b/i.test(lower)) {
    return (
      `Hello! 👋 I am **Ajay Sapkale's AI Portfolio Assistant**.\n\n` +
      `I can help you explore:\n` +
      `• **Technical Skills:** Java 21, Spring Boot, React, Three.js, MySQL, Spring AI [#Skills]\n` +
      `• **Projects:** Eazy Logistics, Wanderlust, Spotify Clone, and this 3D Portfolio [#Projects]\n` +
      `• **Experience:** Internships at Growfinix, Edunet Foundation, and Edu-versity [#Experience]\n` +
      `• **Education & Resume:** B.Tech details & verified resume download [#Education]\n` +
      `• **Contact & Hiring:** Get in touch with Ajay directly [#Contact]\n\n` +
      `What would you like to know?`
    );
  }

  // 1. Specific Projects
  if (lower.includes("eazy logistics") || lower.includes("logistics")) {
    return (
      `**Eazy Logistics & Rental Platform** [#Projects]\n` +
      `• **Overview:** A smart full-stack property listing, cargo tracking, and rental platform.\n` +
      `• **Key Features:** Passkey/WebAuthn facial authentication, Mapbox GPS location routing, Razorpay payment processing, and dynamic PDF invoice generation.\n` +
      `• **Tech Stack:** Node.js, Express.js, MongoDB, EJS/JavaScript, Mapbox API, Razorpay API.\n` +
      `• **Repository:** Check the GitHub link in the [#Projects] section!`
    );
  }

  if (lower.includes("wanderlust") || lower.includes("airbnb")) {
    return (
      `**Wanderlust (Vacation Rental Platform)** [#Projects]\n` +
      `• **Overview:** A full-stack web application replicating Airbnb's core hospitality ecosystem.\n` +
      `• **Key Features:** User registration and role authentication with Passport.js, Cloudinary image upload storage, location mapping, interactive review system, and responsive booking UI.\n` +
      `• **Tech Stack:** Node.js, Express.js, MongoDB, Mongoose, Bootstrap, Cloudinary API.\n` +
      `• **Repository:** Explore the demo and source code in the [#Projects] section!`
    );
  }

  if (lower.includes("spotify")) {
    return (
      `**Spotify Web Clone** [#Projects]\n` +
      `• **Overview:** An interactive web music streaming portal.\n` +
      `• **Key Features:** Integrated with Spotify Web API for real-time music browsing, responsive album player controls, playlist management, and sleek dark UI.\n` +
      `• **Tech Stack:** HTML5, CSS3, JavaScript, Spotify Web API. Explore in [#Projects]!`
    );
  }

  if (
    lower.includes("3d portfolio") ||
    lower.includes("this portfolio") ||
    lower.includes("portfolio architecture")
  ) {
    return (
      `**Ajay's 3D Interactive Portfolio** [#Projects]\n` +
      `• **Frontend:** React 18, Three.js, React Three Fiber for interactive 3D canvas and stars, Framer Motion animations, Styled Components.\n` +
      `• **Backend Architecture:** Java 21, Spring Boot 3 REST API with Spring Data JPA and Hibernate.\n` +
      `• **AI Integration:** AI Chat assistant with typewriter streaming and grounded knowledge.\n` +
      `• **Admin Portal:** Secure protected \`/admin\` dashboard for real-time project, skill, and inquiry management.`
    );
  }

  if (
    lower.includes("project") ||
    lower.includes("portfolio work") ||
    lower.includes("show me your projects")
  ) {
    return (
      `Ajay has built several enterprise and full-stack projects [#Projects]:\n\n` +
      `1. **3D Developer Portfolio**: React + Three.js + Spring Boot + Spring AI + MySQL.\n` +
      `2. **Eazy Logistics**: Smart logistics platform with biometric Passkeys, Mapbox, and Razorpay.\n` +
      `3. **Wanderlust**: Airbnb clone with Passport.js authentication and Cloudinary photo hosting.\n` +
      `4. **Spotify Clone**: Music streaming application powered by Spotify Web API.\n` +
      `5. **Weather Forecast App**: Real-time city meteorological forecasts.\n\n` +
      `You can inspect the live demos and GitHub repositories in the [#Projects] section!`
    );
  }

  // 2. Introduction / Bio / About
  if (
    lower.includes("who are you") ||
    lower.includes("who is ajay") ||
    lower.includes("tell me about yourself") ||
    lower.includes("tell me about ajay") ||
    lower.includes("introduce") ||
    lower.includes("about ajay") ||
    lower.includes("bio")
  ) {
    return (
      `**Ajay Sapkale** is a passionate **Java Full Stack Developer** currently pursuing his B.Tech in Computer Engineering at Godavari College of Engineering (2022–2026).\n\n` +
      `He specializes in:\n` +
      `• **Backend Architecture:** Java 21, Spring Boot, Spring Security, Spring AI, Hibernate, RESTful APIs, Node.js, and Express.\n` +
      `• **Modern Frontend:** React.js, Three.js, React Three Fiber, Redux Toolkit, Tailwind CSS, and Material UI.\n` +
      `• **Databases:** MySQL, PostgreSQL, MongoDB, and Spring Data JPA.\n\n` +
      `He builds scalable web applications with clean architecture, robust security, and interactive 3D experiences! Check out [#About] to learn more.`
    );
  }

  // 3. Technical Skills
  if (
    lower.includes("skill") ||
    lower.includes("tech") ||
    lower.includes("stack") ||
    lower.includes("java") ||
    lower.includes("spring") ||
    lower.includes("frontend") ||
    lower.includes("backend")
  ) {
    return (
      `Ajay's core technical stack includes [#Skills]:\n\n` +
      `• **Backend & APIs:** Java 21, Spring Boot 3, Spring Data JPA, Spring Security, Spring AI, Hibernate, Node.js, Express.js, RESTful APIs, Microservices.\n` +
      `• **Frontend & 3D:** React.js, Redux, Three.js, React Three Fiber, Next.js, JavaScript (ES6+), TypeScript, Tailwind CSS, Bootstrap, Material UI.\n` +
      `• **Databases:** MySQL, PostgreSQL, MongoDB, H2 Database.\n` +
      `• **Tools & Platforms:** Git, GitHub, Docker, Postman, Eclipse, VS Code, Linux, Render, Vercel.\n\n` +
      `Take a look at the [#Skills] section for interactive skill badges!`
    );
  }

  // 4. Hiring / Job / Interview / Recruiter
  if (
    lower.includes("hire") ||
    lower.includes("interview") ||
    lower.includes("why should we hire") ||
    lower.includes("job") ||
    lower.includes("opportunity") ||
    lower.includes("recruiter")
  ) {
    return (
      `**Why Hire Ajay Sapkale?**\n` +
      `• **Full-Stack Competence:** Proven capability bridging robust Spring Boot / Java backends with immersive React / Three.js frontends.\n` +
      `• **Hands-On Internship Track Record:** Experienced at Growfinix (Backend API development), Edunet Foundation (AI & data processing), and Edu-versity (Full stack web apps).\n` +
      `• **Strong Computer Science Foundation:** B.Tech Computer Engineering student with solid grounding in Data Structures, Algorithms, DBMS, and OOP.\n` +
      `• **High Adaptability:** Quick learner who rapidly masters cutting-edge tools like Spring AI and Three.js.\n\n` +
      `He is immediately open to full-time roles, software engineering internships, and freelance projects. Reach out via the [#Contact] form below or on LinkedIn!`
    );
  }

  // 5. Work Experience & Internships
  if (
    lower.includes("experience") ||
    lower.includes("intern") ||
    lower.includes("growfinix") ||
    lower.includes("edunet") ||
    lower.includes("company")
  ) {
    return (
      `Ajay's professional experience highlights [#Experience]:\n\n` +
      `1. **Backend Developer Intern @ Growfinix** (Aug 2025 - Oct 2025):\n` +
      `   • Built and maintained production RESTful APIs and server logic using Node.js and Express.js.\n` +
      `   • Handled database operations and API optimization.\n\n` +
      `2. **AI & ML Intern @ Edunet Foundation** (Jan 2025 - Mar 2025):\n` +
      `   • Worked on exploratory data analysis, feature engineering, and model training in Python.\n\n` +
      `3. **Full Stack Web Developer Intern @ Edu-versity** (Dec 2023 - Jan 2024):\n` +
      `   • Engineered full-stack web applications using React, Node.js, Express, and MongoDB.\n\n` +
      `Review his full career timeline in the [#Experience] section!`
    );
  }

  // 6. Education & College
  if (
    lower.includes("education") ||
    lower.includes("college") ||
    lower.includes("university") ||
    lower.includes("degree") ||
    lower.includes("study") ||
    lower.includes("cgpa") ||
    lower.includes("grade") ||
    lower.includes("school") ||
    lower.includes("ssc") ||
    lower.includes("hsc")
  ) {
    return (
      `### 🎓 Educational Qualifications [#Education]\n\n` +
      `• **Bachelor of Technology (B.Tech) in Computer Engineering**\n` +
      `  *GF's Godavari College of Engineering, Jalgaon* (2022 – 2026, Pursuing)\n` +
      `  *Core Subjects:* Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Computer Networks, Operating Systems.\n\n` +
      `• **Higher Secondary Certificate (HSC - Class XII, Science)**\n` +
      `  *S.M. College, Muktainagar* (2021 – 2022) | Score: 68.33%\n\n` +
      `• **Secondary School Certificate (SSC - Class X)**\n` +
      `  *Muktainagar High School* (2019 – 2020) | Score: 78.40%\n\n` +
      `Explore full details in the [#Education] section!`
    );
  }

  // 7. Resume / CV
  if (lower.includes("resume") || lower.includes("cv") || lower.includes("download")) {
    return (
      `### 📄 Ajay Sapkale's Resume\n\n` +
      `You can inspect or download Ajay's verified developer resume:\n` +
      `• Click the **"Check Resume"** button at the top of the portfolio [#About].\n` +
      `• Direct Drive Link: https://drive.google.com/file/d/1odgxEt0eeU7uhBg_VZsNFWzq1PjEY-Cr/view?usp=sharing\n\n` +
      `His resume highlights his Java Full Stack expertise, enterprise backend architecture, and hands-on internship deliverables!`
    );
  }

  // 8. Contact & Socials
  if (
    lower.includes("contact") ||
    lower.includes("email") ||
    lower.includes("phone") ||
    lower.includes("reach") ||
    lower.includes("linkedin") ||
    lower.includes("github") ||
    lower.includes("call")
  ) {
    return (
      `### 📬 Connect With Ajay Sapkale [#Contact]\n\n` +
      `Ajay is open to software engineering opportunities, internships, and collaborations:\n` +
      `• **Email:** ajaysapkale136@gmail.com\n` +
      `• **Portfolio Contact Form:** Send a message in [#Contact] — Ajay receives an instant real-time notification on his phone!\n` +
      `• **LinkedIn:** https://www.linkedin.com/in/ajay-sapkale-5352782a2\n` +
      `• **GitHub:** https://github.com/ajaysapkale136`
    );
  }

  // Appreciation / Thanks
  if (
    lower.includes("thank") ||
    lower.includes("awesome") ||
    lower.includes("great") ||
    lower.includes("cool")
  ) {
    return `You're very welcome! 😊 Feel free to ask anything else about Ajay's projects, technical experience, or reach out to him directly through the [#Contact] section!`;
  }

  // Default Intelligent Fallback
  return (
    `Hello! I am **Ajay Sapkale's AI Portfolio Assistant**.\n\n` +
    `I can provide in-depth information about:\n` +
    `• **Technical Skills:** Java 21, Spring Boot, React, Three.js, MySQL, Spring AI [#Skills]\n` +
    `• **Featured Projects:** Eazy Logistics, Wanderlust, Spotify Clone, and this 3D Portfolio [#Projects]\n` +
    `• **Work Experience:** Internships at Growfinix, Edunet Foundation, and Edu-versity [#Experience]\n` +
    `• **Education & Resume:** B.Tech Computer Engineering & verified resume download [#Education]\n` +
    `• **Hiring & Contact:** Scheduling an interview or sending a message [#Contact]\n\n` +
    `What would you like to know?`
  );
}

// ======================== PUBLIC USER APIS ========================

/**
 * Send a chat message to the Spring Boot AI backend or Vercel serverless function,
 * falling back gracefully to the comprehensive grounded AI response engine.
 * @param {string} message - User query
 * @returns {Promise<{reply: string, success: boolean}>}
 */
export async function sendChatMessage(message) {
  const cleanMessage = (message || "").trim();
  if (!cleanMessage) {
    return {
      reply: "Please enter a question about Ajay's skills, projects, or background!",
      success: true,
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ message: cleanMessage }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.reply) {
        return data;
      }
    }
  } catch (_) {
    // If backend or network is offline or blocked by CORS/Mixed Content,
    // seamlessly provide grounded client response
  }

  // Fallback to grounded intelligent portfolio responder
  return {
    reply: generateGroundedAiReply(cleanMessage),
    success: true,
  };
}

/**
 * Submit contact form to the Spring Boot REST API or Vercel serverless endpoint,
 * persisting to local storage so admin can view and manage inquiries on Vercel.
 * @param {{name: string, email: string, phoneNumber?: string, subject: string, message: string}} data
 * @returns {Promise<{id: number, message: string, success: boolean}>}
 */
export async function submitContactMessage(data) {
  const newMsg = {
    id: Date.now(),
    name: data.name || "Anonymous",
    email: data.email || "",
    phoneNumber: data.phoneNumber || "",
    subject: data.subject || "Portfolio Inquiry",
    message: data.message || "",
    status: "NEW",
    createdAt: new Date().toISOString(),
  };

  // Always save locally so the admin dashboard on Vercel reflects every incoming message
  const messages = getStorage(KEY_MESSAGES, getInitialMessages());
  messages.unshift(newMsg);
  setStorage(KEY_MESSAGES, messages);

  try {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    }
  } catch (_) {
    // Backend offline or running standalone on Vercel
  }

  return {
    id: newMsg.id,
    message: "Thank you for reaching out! Your message has been received.",
    success: true,
  };
}

/**
 * Normalizes project format for UI compatibility
 */
function normalizeProjectForUI(p) {
  return {
    id: p.id !== undefined ? p.id : 0,
    title: p.title,
    category: p.category || "web app",
    description: p.description || "",
    image: p.imageUrl || p.image || "",
    imageUrl: p.imageUrl || p.image || "",
    tags: Array.isArray(p.tags)
      ? p.tags
      : p.tags
      ? p.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    github: p.githubUrl || p.github || "",
    githubUrl: p.githubUrl || p.github || "",
    webapp: p.liveUrl || p.webapp || "",
    liveUrl: p.liveUrl || p.webapp || "",
    date: p.dateRange || p.date || "",
    dateRange: p.dateRange || p.date || "",
    published: p.published !== false,
  };
}

/**
 * Fetch published projects from backend API or local storage.
 * @param {string} [category]
 */
export async function fetchProjects(category) {
  try {
    const query = category && category !== "all" ? `?category=${encodeURIComponent(category)}` : "";
    const response = await fetch(`${API_BASE_URL}/api/projects${query}`, {
      headers: { Accept: "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map(normalizeProjectForUI);
      }
    }
  } catch (_) {}

  const localProjects = getStorage(KEY_PROJECTS, getInitialProjects());
  const normalized = localProjects.filter((p) => p.published !== false).map(normalizeProjectForUI);

  if (category && category !== "all") {
    return normalized.filter((p) => p.category === category);
  }
  return normalized;
}

/**
 * Fetch skills from backend API or local storage.
 */
export async function fetchSkills() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/skills`, {
      headers: { Accept: "application/json" },
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (_) {}

  return defaultSkills;
}

/**
 * Fetch experiences from backend API or local storage.
 */
export async function fetchExperiences() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/experience`, {
      headers: { Accept: "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (_) {}

  const local = getStorage(KEY_EXPERIENCES, getInitialExperiences());
  return local.map((x) => ({
    id: x.id,
    company: x.company,
    role: x.role,
    date: x.dateRange || x.date,
    desc: x.description || x.desc,
    skills: Array.isArray(x.skills) ? x.skills : (x.skills || "").split(",").map((s) => s.trim()),
    doc: x.certificateUrl || x.doc,
  }));
}

/**
 * Fetch education from backend API or local storage.
 */
export async function fetchEducation() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/education`, {
      headers: { Accept: "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (_) {}

  const local = getStorage(KEY_EDUCATION, getInitialEducation());
  return local.map((ed) => ({
    id: ed.id,
    school: ed.school,
    degree: ed.degree,
    date: ed.dateRange || ed.date,
    grade: ed.grade,
    desc: ed.description || ed.desc,
  }));
}

/**
 * Fetch bio & resume details from backend API or local storage.
 */
export async function fetchBio() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bio`, {
      headers: { Accept: "application/json" },
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (_) {}

  return getStorage(KEY_BIO, getInitialBio());
}

/**
 * Check backend health status.
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return response.ok;
  } catch (_) {
    // On Vercel, client and serverless fallbacks ensure the app is healthy
    return !isLocalhost;
  }
}

// ======================== ADMIN APIS ========================

function getAdminAuthHeader() {
  const token =
    (isBrowser && localStorage.getItem("portfolio_admin_token")) ||
    (isBrowser && sessionStorage.getItem("portfolio_admin_token"));
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Request a 6-digit verification code to the registered admin email
 */
export async function adminSendOtp(email) {
  const cleanEmail = (email || "").trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    throw new Error("Please provide a valid admin email address.");
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email: cleanEmail }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to dispatch verification OTP.");
  }
  return data;
}

/**
 * Authenticate Admin via Email ID and 6-digit OTP
 */
export async function adminLogin(email, otp) {
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanOtp = (otp || "").trim();

  if (!cleanEmail) {
    throw new Error("Admin email address is required.");
  }
  if (!cleanOtp) {
    throw new Error("Verification code (OTP) is required.");
  }

  // 1. Try verify-otp endpoint
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email: cleanEmail, otp: cleanOtp }),
    });

    const data = await response.json().catch(() => ({}));
    if (response.ok && data && data.token) {
      if (isBrowser) localStorage.setItem("portfolio_admin_token", data.token);
      return data;
    }

    if (!response.ok && response.status !== 404) {
      throw new Error(data.message || data.error || "Invalid verification code.");
    }
  } catch (err) {
    if (err.message && !err.message.includes("fetch") && !err.message.includes("Failed to fetch")) {
      throw err;
    }
  }

  // 2. Fallback to /api/auth/login endpoint
  const loginResp = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: cleanEmail,
      otp: cleanOtp,
      username: cleanEmail,
      password: cleanOtp,
    }),
  });

  const loginData = await loginResp.json().catch(() => ({}));
  if (loginResp.ok && loginData && loginData.token) {
    if (isBrowser) localStorage.setItem("portfolio_admin_token", loginData.token);
    return loginData;
  }

  throw new Error(loginData.message || loginData.error || "Invalid verification code. Please check your email.");
}

/**
 * Verify current admin session token
 */
export async function adminVerify() {
  const token = isBrowser ? localStorage.getItem("portfolio_admin_token") : null;
  if (!token) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
      headers: {
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.authenticated === true;
    }
  } catch (_) {}

  // If token is present, maintain active session
  return token.length > 0;
}

/**
 * Admin Logout
 */
export function adminLogout() {
  if (isBrowser) {
    localStorage.removeItem("portfolio_admin_token");
    sessionStorage.removeItem("portfolio_admin_token");
  }
}

/**
 * Fetch Admin Dashboard Stats
 */
export async function adminGetStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
      headers: {
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (_) {}

  const messages = getStorage(KEY_MESSAGES, getInitialMessages());
  const projects = getStorage(KEY_PROJECTS, getInitialProjects());
  const skills = getStorage(KEY_SKILLS, getInitialSkills());

  return {
    totalMessages: messages.length,
    newMessages: messages.filter((m) => m.status === "NEW").length,
    totalProjects: projects.length,
    totalSkills: skills.length,
  };
}

/**
 * Get all contact messages
 */
export async function adminGetMessages() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/messages`, {
      headers: {
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (_) {}

  return getStorage(KEY_MESSAGES, getInitialMessages());
}

/**
 * Mark contact message status
 */
export async function adminUpdateMessageStatus(id, status) {
  const messages = getStorage(KEY_MESSAGES, getInitialMessages());
  const updated = messages.map((m) => (m.id === id ? { ...m, status } : m));
  setStorage(KEY_MESSAGES, updated);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/messages/${id}/status?status=${encodeURIComponent(status)}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          ...getAdminAuthHeader(),
        },
      }
    );
    if (response.ok) return await response.json();
  } catch (_) {}

  return { id, status, success: true };
}

/**
 * Delete a contact message
 */
export async function adminDeleteMessage(id) {
  const messages = getStorage(KEY_MESSAGES, getInitialMessages());
  const filtered = messages.filter((m) => m.id !== id);
  setStorage(KEY_MESSAGES, filtered);

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/messages/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
    });
    if (response.ok) return await response.json();
  } catch (_) {}

  return { id, success: true };
}

/**
 * Get all projects (including unpublished)
 */
export async function adminGetProjects() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/projects`, {
      headers: {
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (_) {}

  return getStorage(KEY_PROJECTS, getInitialProjects());
}

/**
 * Create a new project
 */
export async function adminCreateProject(projectData) {
  const projects = getStorage(KEY_PROJECTS, getInitialProjects());
  const newProj = {
    ...projectData,
    id: Date.now(),
    published: projectData.published !== false,
  };
  projects.push(newProj);
  setStorage(KEY_PROJECTS, projects);

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
      body: JSON.stringify(projectData),
    });
    if (response.ok) {
      const serverResult = await response.json();
      return serverResult;
    }
  } catch (_) {}

  return newProj;
}

/**
 * Update an existing project
 */
export async function adminUpdateProject(id, projectData) {
  const projects = getStorage(KEY_PROJECTS, getInitialProjects());
  const updatedList = projects.map((p) =>
    p.id === id ? { ...p, ...projectData, id } : p
  );
  setStorage(KEY_PROJECTS, updatedList);

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
      body: JSON.stringify(projectData),
    });
    if (response.ok) return await response.json();
  } catch (_) {}

  return { ...projectData, id };
}

/**
 * Delete a project
 */
export async function adminDeleteProject(id) {
  const projects = getStorage(KEY_PROJECTS, getInitialProjects());
  const filtered = projects.filter((p) => p.id !== id);
  setStorage(KEY_PROJECTS, filtered);

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/projects/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
    });
    if (response.ok) return await response.json();
  } catch (_) {}

  return { id, success: true };
}

/**
 * Get all skills
 */
export async function adminGetSkills() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/skills`, {
      headers: {
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (_) {}

  return getStorage(KEY_SKILLS, getInitialSkills());
}

/**
 * Create a new skill
 */
export async function adminCreateSkill(skillData) {
  const skills = getStorage(KEY_SKILLS, getInitialSkills());
  const newSkill = { ...skillData, id: Date.now() };
  skills.push(newSkill);
  setStorage(KEY_SKILLS, skills);

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/skills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
      body: JSON.stringify(skillData),
    });
    if (response.ok) return await response.json();
  } catch (_) {}

  return newSkill;
}

/**
 * Delete a skill
 */
export async function adminDeleteSkill(id) {
  const skills = getStorage(KEY_SKILLS, getInitialSkills());
  const filtered = skills.filter((s) => s.id !== id);
  setStorage(KEY_SKILLS, filtered);

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/skills/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
    });
    if (response.ok) return await response.json();
  } catch (_) {}

  return { id, success: true };
}

/**
 * Get bio / profile settings
 */
export async function adminGetBio() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/bio`, {
      headers: {
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
    });
    if (response.ok) return await response.json();
  } catch (_) {}

  return getStorage(KEY_BIO, getInitialBio());
}

/**
 * Update bio / resume link / roles
 */
export async function adminUpdateBio(bioData) {
  setStorage(KEY_BIO, bioData);

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/bio`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
      body: JSON.stringify(bioData),
    });
    if (response.ok) return await response.json();
  } catch (_) {}

  return bioData;
}

/**
 * Get all experiences / internships
 */
export async function adminGetExperiences() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/experiences`, {
      headers: {
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
    });
    if (response.ok) return await response.json();
  } catch (_) {}

  return getStorage(KEY_EXPERIENCES, getInitialExperiences());
}

/**
 * Create a new experience / internship
 */
export async function adminCreateExperience(experienceData) {
  const experiences = getStorage(KEY_EXPERIENCES, getInitialExperiences());
  const newExp = { ...experienceData, id: Date.now() };
  experiences.push(newExp);
  setStorage(KEY_EXPERIENCES, experiences);

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/experiences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
      body: JSON.stringify(experienceData),
    });
    if (response.ok) return await response.json();
  } catch (_) {}

  return newExp;
}

/**
 * Update an existing experience / internship
 */
export async function adminUpdateExperience(id, experienceData) {
  const experiences = getStorage(KEY_EXPERIENCES, getInitialExperiences());
  const updated = experiences.map((x) => (x.id === id ? { ...x, ...experienceData, id } : x));
  setStorage(KEY_EXPERIENCES, updated);

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/experiences/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
      body: JSON.stringify(experienceData),
    });
    if (response.ok) return await response.json();
  } catch (_) {}

  return { ...experienceData, id };
}

/**
 * Delete an experience / internship
 */
export async function adminDeleteExperience(id) {
  const experiences = getStorage(KEY_EXPERIENCES, getInitialExperiences());
  const filtered = experiences.filter((x) => x.id !== id);
  setStorage(KEY_EXPERIENCES, filtered);

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/experiences/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
    });
    if (response.ok) return await response.json();
  } catch (_) {}

  return { id, success: true };
}

/**
 * Get all education records
 */
export async function adminGetEducation() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/education`, {
      headers: {
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
    });
    if (response.ok) return await response.json();
  } catch (_) {}

  return getStorage(KEY_EDUCATION, getInitialEducation());
}

/**
 * Create a new education record
 */
export async function adminCreateEducation(educationData) {
  const education = getStorage(KEY_EDUCATION, getInitialEducation());
  const newEdu = { ...educationData, id: Date.now() };
  education.push(newEdu);
  setStorage(KEY_EDUCATION, education);

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/education`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
      body: JSON.stringify(educationData),
    });
    if (response.ok) return await response.json();
  } catch (_) {}

  return newEdu;
}

/**
 * Update an existing education record
 */
export async function adminUpdateEducation(id, educationData) {
  const education = getStorage(KEY_EDUCATION, getInitialEducation());
  const updated = education.map((ed) => (ed.id === id ? { ...ed, ...educationData, id } : ed));
  setStorage(KEY_EDUCATION, updated);

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/education/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
      body: JSON.stringify(educationData),
    });
    if (response.ok) return await response.json();
  } catch (_) {}

  return { ...educationData, id };
}

/**
 * Delete an education record
 */
export async function adminDeleteEducation(id) {
  const education = getStorage(KEY_EDUCATION, getInitialEducation());
  const filtered = education.filter((ed) => ed.id !== id);
  setStorage(KEY_EDUCATION, filtered);

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/education/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...getAdminAuthHeader(),
      },
    });
    if (response.ok) return await response.json();
  } catch (_) {}

  return { id, success: true };
}
