const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

/**
 * Send a chat message to the Spring Boot + Spring AI backend.
 * @param {string} message - User query
 * @returns {Promise<{reply: string, success: boolean}>}
 */
export async function sendChatMessage(message) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ message: message.trim() }),
  });

  if (!response.ok) {
    let errorDetail = "Chat service is temporarily unavailable. Please try again.";
    try {
      const errJson = await response.json();
      if (errJson && errJson.message) {
        errorDetail = errJson.message;
      }
    } catch (_) {
      // Ignore JSON parse error on non-JSON response
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

/**
 * Submit contact form to the Spring Boot REST API.
 * @param {{name: string, email: string, subject: string, message: string}} data
 * @returns {Promise<{id: number, message: string, success: boolean}>}
 */
export async function submitContactMessage(data) {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorDetail = "Failed to submit message to portfolio server.";
    try {
      const errJson = await response.json();
      if (errJson && errJson.message) {
        errorDetail = errJson.message;
      } else if (errJson && errJson.details && errJson.details.length > 0) {
        errorDetail = errJson.details.join(", ");
      }
    } catch (_) {}
    throw new Error(errorDetail);
  }

  return response.json();
}

/**
 * Fetch published projects from backend API.
 * @param {string} [category]
 */
export async function fetchProjects(category) {
  const query = category && category !== "all" ? `?category=${encodeURIComponent(category)}` : "";
  const response = await fetch(`${API_BASE_URL}/api/projects${query}`, {
    headers: { "Accept": "application/json" }
  });
  if (!response.ok) throw new Error("Failed to load projects from server");
  return response.json();
}

/**
 * Fetch skills from backend API.
 */
export async function fetchSkills() {
  const response = await fetch(`${API_BASE_URL}/api/skills`, {
    headers: { "Accept": "application/json" }
  });
  if (!response.ok) throw new Error("Failed to load skills from server");
  return response.json();
}

/**
 * Fetch experiences from backend API.
 */
export async function fetchExperiences() {
  const response = await fetch(`${API_BASE_URL}/api/experience`, {
    headers: { "Accept": "application/json" }
  });
  if (!response.ok) throw new Error("Failed to load experiences from server");
  return response.json();
}

/**
 * Fetch education from backend API.
 */
export async function fetchEducation() {
  const response = await fetch(`${API_BASE_URL}/api/education`, {
    headers: { "Accept": "application/json" }
  });
  if (!response.ok) throw new Error("Failed to load education from server");
  return response.json();
}

/**
 * Fetch bio & resume details from backend API.
 */
export async function fetchBio() {
  const response = await fetch(`${API_BASE_URL}/api/bio`, {
    headers: { "Accept": "application/json" }
  });
  if (!response.ok) throw new Error("Failed to load bio from server");
  return response.json();
}

/**
 * Check backend health status.
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });
    return response.ok;
  } catch (_) {
    return false;
  }
}

// ======================== ADMIN APIS ========================

function getAdminAuthHeader() {
  const token = localStorage.getItem("portfolio_admin_token") || sessionStorage.getItem("portfolio_admin_token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

/**
 * Login as Admin
 */
export async function adminLogin(username, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  const data = await response.json();
  if (data.token) {
    localStorage.setItem("portfolio_admin_token", data.token);
  }
  return data;
}

/**
 * Verify current admin session token
 */
export async function adminVerify() {
  const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
    headers: {
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
  });
  if (!response.ok) return false;
  const data = await response.json();
  return data.authenticated === true;
}

/**
 * Admin Logout
 */
export function adminLogout() {
  localStorage.removeItem("portfolio_admin_token");
  sessionStorage.removeItem("portfolio_admin_token");
}

/**
 * Fetch Admin Dashboard Stats
 */
export async function adminGetStats() {
  const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
    headers: {
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
  });
  if (!response.ok) throw new Error("Failed to load admin stats");
  return response.json();
}

/**
 * Get all contact messages
 */
export async function adminGetMessages() {
  const response = await fetch(`${API_BASE_URL}/api/admin/messages`, {
    headers: {
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
  });
  if (!response.ok) throw new Error("Failed to load messages");
  return response.json();
}

/**
 * Mark contact message status
 */
export async function adminUpdateMessageStatus(id, status) {
  const response = await fetch(`${API_BASE_URL}/api/admin/messages/${id}/status?status=${encodeURIComponent(status)}`, {
    method: "PUT",
    headers: {
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
  });
  if (!response.ok) throw new Error("Failed to update message status");
  return response.json();
}

/**
 * Delete a contact message
 */
export async function adminDeleteMessage(id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/messages/${id}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
  });
  if (!response.ok) throw new Error("Failed to delete message");
  return response.json();
}

/**
 * Get all projects (including unpublished)
 */
export async function adminGetProjects() {
  const response = await fetch(`${API_BASE_URL}/api/admin/projects`, {
    headers: {
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
  });
  if (!response.ok) throw new Error("Failed to load projects");
  return response.json();
}

/**
 * Create a new project
 */
export async function adminCreateProject(projectData) {
  const response = await fetch(`${API_BASE_URL}/api/admin/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
    body: JSON.stringify(projectData),
  });
  if (!response.ok) throw new Error("Failed to create project");
  return response.json();
}

/**
 * Update an existing project
 */
export async function adminUpdateProject(id, projectData) {
  const response = await fetch(`${API_BASE_URL}/api/admin/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
    body: JSON.stringify(projectData),
  });
  if (!response.ok) throw new Error("Failed to update project");
  return response.json();
}

/**
 * Delete a project
 */
export async function adminDeleteProject(id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/projects/${id}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
  });
  if (!response.ok) throw new Error("Failed to delete project");
  return response.json();
}

/**
 * Get all skills
 */
export async function adminGetSkills() {
  const response = await fetch(`${API_BASE_URL}/api/admin/skills`, {
    headers: {
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
  });
  if (!response.ok) throw new Error("Failed to load skills");
  return response.json();
}

/**
 * Create a new skill
 */
export async function adminCreateSkill(skillData) {
  const response = await fetch(`${API_BASE_URL}/api/admin/skills`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
    body: JSON.stringify(skillData),
  });
  if (!response.ok) throw new Error("Failed to create skill");
  return response.json();
}

/**
 * Delete a skill
 */
export async function adminDeleteSkill(id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/skills/${id}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
  });
  if (!response.ok) throw new Error("Failed to delete skill");
  return response.json();
}

/**
 * Get bio / profile settings
 */
export async function adminGetBio() {
  const response = await fetch(`${API_BASE_URL}/api/admin/bio`, {
    headers: {
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
  });
  if (!response.ok) throw new Error("Failed to load bio");
  return response.json();
}

/**
 * Update bio / resume link / roles
 */
export async function adminUpdateBio(bioData) {
  const response = await fetch(`${API_BASE_URL}/api/admin/bio`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
    body: JSON.stringify(bioData),
  });
  if (!response.ok) throw new Error("Failed to update profile / resume");
  return response.json();
}

/**
 * Get all experiences / internships
 */
export async function adminGetExperiences() {
  const response = await fetch(`${API_BASE_URL}/api/admin/experiences`, {
    headers: {
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
  });
  if (!response.ok) throw new Error("Failed to load experiences");
  return response.json();
}

/**
 * Create a new experience / internship
 */
export async function adminCreateExperience(experienceData) {
  const response = await fetch(`${API_BASE_URL}/api/admin/experiences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
    body: JSON.stringify(experienceData),
  });
  if (!response.ok) throw new Error("Failed to create experience");
  return response.json();
}

/**
 * Update an existing experience / internship
 */
export async function adminUpdateExperience(id, experienceData) {
  const response = await fetch(`${API_BASE_URL}/api/admin/experiences/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
    body: JSON.stringify(experienceData),
  });
  if (!response.ok) throw new Error("Failed to update experience");
  return response.json();
}

/**
 * Delete an experience / internship
 */
export async function adminDeleteExperience(id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/experiences/${id}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
  });
  if (!response.ok) throw new Error("Failed to delete experience");
  return response.json();
}

/**
 * Get all education records
 */
export async function adminGetEducation() {
  const response = await fetch(`${API_BASE_URL}/api/admin/education`, {
    headers: {
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
  });
  if (!response.ok) throw new Error("Failed to load education");
  return response.json();
}

/**
 * Create a new education record
 */
export async function adminCreateEducation(educationData) {
  const response = await fetch(`${API_BASE_URL}/api/admin/education`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
    body: JSON.stringify(educationData),
  });
  if (!response.ok) throw new Error("Failed to create education record");
  return response.json();
}

/**
 * Update an existing education record
 */
export async function adminUpdateEducation(id, educationData) {
  const response = await fetch(`${API_BASE_URL}/api/admin/education/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
    body: JSON.stringify(educationData),
  });
  if (!response.ok) throw new Error("Failed to update education record");
  return response.json();
}

/**
 * Delete an education record
 */
export async function adminDeleteEducation(id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/education/${id}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      ...getAdminAuthHeader(),
    },
  });
  if (!response.ok) throw new Error("Failed to delete education record");
  return response.json();
}
