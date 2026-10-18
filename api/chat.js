// Vercel Serverless Function: /api/chat
// Grounded AI Chat Assistant for Ajay Sapkale's 3D Portfolio

const GROUNDED_PORTFOLIO_INFO = {
  bio: {
    name: "Ajay Sapkale",
    roles: [
      "Java Full Stack Developer",
      "Full Stack Developer",
      "MERN Developer",
      "Frontend Developer",
      "Backend Developer"
    ],
    college: "GF's Godavari College of Engineering, Jalgaon",
    degree: "B.Tech in Computer Engineering (2022 - 2026)",
    email: "ajaysapkale136@gmail.com",
    github: "https://github.com/ajaysapkale136",
    linkedin: "https://www.linkedin.com/in/ajay-sapkale-5352782a2",
    resume: "https://drive.google.com/file/d/1odgxEt0eeU7uhBg_VZsNFWzq1PjEY-Cr/view?usp=sharing",
  },
  projects: [
    {
      title: "3D Developer Portfolio",
      tech: "React 18, Three.js, React Three Fiber, Spring Boot, Spring AI, MySQL",
      overview: "Full-stack portfolio featuring interactive 3D Earth and Starfield canvases, AI Chatbot assistant with typewriter streaming, and secure admin control portal.",
      sectionPill: "[#Projects]"
    },
    {
      title: "Eazy Logistics & Rental Platform",
      tech: "Node.js, Express.js, MongoDB, WebAuthn Passkeys, Mapbox GPS, Razorpay API",
      overview: "Smart property listing and cargo tracking platform featuring biometric facial authentication via Passkeys, live route navigation, payments, and PDF receipts.",
      sectionPill: "[#Projects]"
    },
    {
      title: "Wanderlust (Airbnb Clone)",
      tech: "Node.js, Express.js, MongoDB, Passport.js, Cloudinary API, Bootstrap",
      overview: "Vacation rental marketplace with user authentication, photo hosting, geospatial maps, interactive reviews, and responsive booking UI.",
      sectionPill: "[#Projects]"
    },
    {
      title: "Spotify Clone",
      tech: "HTML5, CSS3, JavaScript, Spotify Web API",
      overview: "Responsive web music streaming platform with real-time music browsing, audio player controls, and playlist curation.",
      sectionPill: "[#Projects]"
    },
    {
      title: "Weather Forecast Application",
      tech: "React.js, OpenWeatherMap API, Tailwind CSS",
      overview: "Real-time meteorological forecast application providing temperature, humidity, wind metrics, and 5-day weather projections.",
      sectionPill: "[#Projects]"
    }
  ],
  internships: [
    {
      company: "Growfinix",
      role: "Backend Developer Intern",
      date: "Aug 2025 - Oct 2025",
      details: "Engineered scalable RESTful APIs, optimized query response times, and built secure authentication endpoints in Node.js & Express."
    },
    {
      company: "Edunet Foundation",
      role: "AI & ML Intern",
      date: "Jan 2025 - Mar 2025",
      details: "Performed exploratory data analysis, data wrangling, and predictive model training using Python and scikit-learn."
    },
    {
      company: "Edu-versity",
      role: "Full Stack Web Developer Intern",
      date: "Dec 2023 - Jan 2024",
      details: "Built responsive frontend views in React.js and integrated backend services using MongoDB and Node.js."
    }
  ]
};

function generateGroundedReply(message) {
  const lower = (message || "").toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|hola|greetings|namaste|sup|yo)\b/i.test(lower)) {
    return `Hello! 👋 I am **Ajay Sapkale's AI Portfolio Assistant**.\n\nI can help you explore:\n• **Technical Skills:** Java 21, Spring Boot, React, Three.js, MySQL, Spring AI.\n• **Projects:** Eazy Logistics, Wanderlust, Spotify Clone, and this 3D Portfolio.\n• **Experience:** Internships at Growfinix, Edunet Foundation, and Edu-versity.\n• **Education & Resume:** B.Tech details & verified resume download.\n• **Contact & Hiring:** Get in touch with Ajay directly.\n\nWhat would you like to know?`;
  }

  // 1. Specific Projects
  if (lower.includes("eazy logistics") || lower.includes("logistics")) {
    return `**Eazy Logistics & Rental Platform** [#Projects]\n• **Overview:** A smart full-stack property listing, cargo tracking, and rental platform.\n• **Key Features:** Passkey/WebAuthn facial authentication, Mapbox GPS location routing, Razorpay payment processing, and dynamic PDF invoice generation.\n• **Tech Stack:** Node.js, Express.js, MongoDB, EJS/JavaScript, Mapbox API, Razorpay API.\n• **Repository:** Check the GitHub link in the [#Projects] section!`;
  }

  if (lower.includes("wanderlust") || lower.includes("airbnb")) {
    return `**Wanderlust (Vacation Rental Platform)** [#Projects]\n• **Overview:** A full-stack web application replicating Airbnb's core hospitality ecosystem.\n• **Key Features:** User registration and role authentication with Passport.js, Cloudinary image upload storage, location mapping, interactive review system, and responsive booking UI.\n• **Tech Stack:** Node.js, Express.js, MongoDB, Mongoose, Bootstrap, Cloudinary API.\n• **Repository:** Explore the demo and source code in the [#Projects] section!`;
  }

  if (lower.includes("spotify")) {
    return `**Spotify Web Clone** [#Projects]\n• **Overview:** An interactive web music streaming portal.\n• **Key Features:** Integrated with Spotify Web API for real-time music browsing, responsive album player controls, playlist management, and sleek dark UI.\n• **Tech Stack:** HTML5, CSS3, JavaScript, Spotify Web API. Explore in [#Projects]!`;
  }

  if (lower.includes("3d portfolio") || lower.includes("this portfolio") || lower.includes("portfolio architecture")) {
    return `**Ajay's 3D Interactive Portfolio** [#Projects]\n• **Frontend:** React 18, Three.js, React Three Fiber for interactive 3D canvas and stars, Framer Motion animations, Styled Components.\n• **Backend Architecture:** Java 21, Spring Boot 3 REST API with Spring Data JPA and Hibernate.\n• **AI Integration:** AI Chat assistant with typewriter streaming and grounded knowledge.\n• **Admin Portal:** Secure protected \`/admin\` dashboard for real-time project, skill, and inquiry management.`;
  }

  if (lower.includes("project") || lower.includes("work") || lower.includes("show me your projects")) {
    return `Ajay has built several enterprise and full-stack projects [#Projects]:\n\n1. **3D Developer Portfolio**: React + Three.js + Spring Boot + Spring AI + MySQL.\n2. **Eazy Logistics**: Smart logistics platform with biometric Passkeys, Mapbox, and Razorpay.\n3. **Wanderlust**: Airbnb clone with Passport.js authentication and Cloudinary photo hosting.\n4. **Spotify Clone**: Music streaming application powered by Spotify Web API.\n5. **Weather Forecast App**: Real-time city meteorological forecasts.\n\nYou can inspect the live demos and GitHub repositories in the [#Projects] section!`;
  }

  // 2. Introduction / Bio / About
  if (lower.includes("who are you") || lower.includes("who is ajay") || lower.includes("tell me about yourself") || lower.includes("tell me about ajay") || lower.includes("introduce") || lower.includes("about ajay") || lower.includes("bio")) {
    return `**Ajay Sapkale** is a passionate **Java Full Stack Developer** currently pursuing his B.Tech in Computer Engineering at Godavari College of Engineering (2022–2026).\n\nHe specializes in:\n• **Backend Architecture:** Java 21, Spring Boot, Spring Security, Spring AI, Hibernate, RESTful APIs, Node.js, and Express.\n• **Modern Frontend:** React.js, Three.js, React Three Fiber, Redux Toolkit, Tailwind CSS, and Material UI.\n• **Databases:** MySQL, PostgreSQL, MongoDB, and Spring Data JPA.\n\nHe builds scalable web applications with clean architecture, robust security, and interactive 3D experiences! Check out [#About] to learn more.`;
  }

  // 3. Technical Skills
  if (lower.includes("skill") || lower.includes("tech") || lower.includes("stack") || lower.includes("java") || lower.includes("spring") || lower.includes("frontend") || lower.includes("backend")) {
    return `Ajay's core technical stack includes [#Skills]:\n\n• **Backend & APIs:** Java 21, Spring Boot 3, Spring Data JPA, Spring Security, Spring AI, Hibernate, Node.js, Express.js, RESTful APIs, Microservices.\n• **Frontend & 3D:** React.js, Redux, Three.js, React Three Fiber, Next.js, JavaScript (ES6+), TypeScript, Tailwind CSS, Bootstrap, Material UI.\n• **Databases:** MySQL, PostgreSQL, MongoDB, H2 Database.\n• **Tools & Platforms:** Git, GitHub, Docker, Postman, Eclipse, VS Code, Linux, Render, Vercel.\n\nTake a look at the [#Skills] section for interactive skill badges!`;
  }

  // 4. Hiring / Job / Interview / Recruiter
  if (lower.includes("hire") || lower.includes("interview") || lower.includes("why should we hire") || lower.includes("job") || lower.includes("opportunity") || lower.includes("recruiter")) {
    return `**Why Hire Ajay Sapkale?**\n• **Full-Stack Competence:** Proven capability bridging robust Spring Boot / Java backends with immersive React / Three.js frontends.\n• **Hands-On Internship Track Record:** Experienced at Growfinix (Backend API development), Edunet Foundation (AI & data processing), and Edu-versity (Full stack web apps).\n• **Strong Computer Science Foundation:** B.Tech Computer Engineering student with solid grounding in Data Structures, Algorithms, DBMS, and OOP.\n• **High Adaptability:** Quick learner who rapidly masters cutting-edge tools like Spring AI and Three.js.\n\nHe is immediately open to full-time roles, software engineering internships, and freelance projects. Reach out via the [#Contact] form below or on LinkedIn!`;
  }

  // 5. Work Experience & Internships
  if (lower.includes("experience") || lower.includes("intern") || lower.includes("growfinix") || lower.includes("edunet") || lower.includes("company")) {
    return `Ajay's professional experience highlights [#Experience]:\n\n1. **Backend Developer Intern @ Growfinix** (Aug 2025 - Oct 2025):\n   • Built and maintained production RESTful APIs and server logic using Node.js and Express.js.\n   • Handled database operations and API optimization.\n\n2. **AI & ML Intern @ Edunet Foundation** (Jan 2025 - Mar 2025):\n   • Worked on exploratory data analysis, feature engineering, and model training in Python.\n\n3. **Full Stack Web Developer Intern @ Edu-versity** (Dec 2023 - Jan 2024):\n   • Engineered full-stack web applications using React, Node.js, Express, and MongoDB.\n\nReview his full career timeline in the [#Experience] section!`;
  }

  // 6. Education & College
  if (lower.includes("education") || lower.includes("college") || lower.includes("university") || lower.includes("degree") || lower.includes("study") || lower.includes("cgpa") || lower.includes("grade") || lower.includes("school") || lower.includes("ssc") || lower.includes("hsc")) {
    return `### 🎓 Educational Qualifications [#Education]\n\n• **Bachelor of Technology (B.Tech) in Computer Engineering**\n  *GF's Godavari College of Engineering, Jalgaon* (2022 – 2026, Pursuing)\n  *Core Subjects:* Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Computer Networks, Operating Systems.\n\n• **Higher Secondary Certificate (HSC - Class XII, Science)**\n  *S.M. College, Muktainagar* (2021 – 2022) | Score: 68.33%\n\n• **Secondary School Certificate (SSC - Class X)**\n  *Muktainagar High School* (2019 – 2020) | Score: 78.40%\n\nExplore full details in the [#Education] section!`;
  }

  // 7. Resume / CV
  if (lower.includes("resume") || lower.includes("cv") || lower.includes("download")) {
    return `### 📄 Ajay Sapkale's Resume\n\nYou can inspect or download Ajay's verified developer resume:\n• Click the **"Check Resume"** button at the top of the portfolio [#About].\n• Direct Drive Link: https://drive.google.com/file/d/1odgxEt0eeU7uhBg_VZsNFWzq1PjEY-Cr/view?usp=sharing\n\nHis resume highlights his Java Full Stack expertise, enterprise backend architecture, and hands-on internship deliverables!`;
  }

  // 8. Contact & Socials
  if (lower.includes("contact") || lower.includes("email") || lower.includes("phone") || lower.includes("reach") || lower.includes("linkedin") || lower.includes("github") || lower.includes("call")) {
    return `### 📬 Connect With Ajay Sapkale [#Contact]\n\nAjay is open to software engineering opportunities, internships, and collaborations:\n• **Email:** ajaysapkale136@gmail.com\n• **Portfolio Contact Form:** Send a message in [#Contact] — Ajay receives an instant real-time notification on his phone!\n• **LinkedIn:** https://www.linkedin.com/in/ajay-sapkale-5352782a2\n• **GitHub:** https://github.com/ajaysapkale136`;
  }

  // Appreciation / Thanks
  if (lower.includes("thank") || lower.includes("awesome") || lower.includes("great") || lower.includes("cool")) {
    return `You're very welcome! 😊 Feel free to ask anything else about Ajay's projects, technical experience, or reach out to him directly through the [#Contact] section!`;
  }

  // Default Intelligent Fallback
  return `Hello! I am **Ajay Sapkale's AI Portfolio Assistant**.\n\nI can provide in-depth information about:\n• **Technical Skills:** Java 21, Spring Boot, React, Three.js, MySQL, Spring AI [#Skills].\n• **Featured Projects:** Eazy Logistics, Wanderlust, Spotify Clone, and this 3D Portfolio [#Projects].\n• **Work Experience:** Internships at Growfinix, Edunet Foundation, and Edu-versity [#Experience].\n• **Education & Resume:** B.Tech Computer Engineering & verified resume download [#Education].\n• **Hiring & Contact:** Scheduling an interview or sending a message [#Contact].\n\nWhat would you like to know?`;
}

module.exports = async function handler(req, res) {
  // CORS setup
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { message } = req.body || {};
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty." });
    }

    const reply = generateGroundedReply(message.trim());
    return res.status(200).json({ reply, success: true });
  } catch (err) {
    return res.status(500).json({
      error: "Internal server error",
      reply: "Hello! I am Ajay's AI assistant. Feel free to ask about his Java Full Stack skills, projects, or experience!",
      success: false
    });
  }
};
