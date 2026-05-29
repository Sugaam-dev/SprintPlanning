// src/Auths.jsx — centralised API endpoint config

const API_BASE_URL = "http://127.0.0.1:8000";
// const API_BASE_URL = "https://sprint-backend-73ho.onrender.com";

const API_ENDPOINTS = {
  // ── Core generation ──────────────────────────────────
  PROCESS_SPRINT: `${API_BASE_URL}/process-sprint`,

  // ── Multi-project endpoints ───────────────────────────
  GET_PROJECTS:            `${API_BASE_URL}/projects`,
  GET_PROJECT:             (projectId) => `${API_BASE_URL}/projects/${projectId}`,
  DELETE_PROJECT:          (projectId) => `${API_BASE_URL}/projects/${projectId}`,
  UPDATE_PROJECT_STATUS:   (projectId) => `${API_BASE_URL}/projects/${projectId}/status`,
  UPDATE_SPRINT_STATUS:    (projectId, sprintId) =>
    `${API_BASE_URL}/projects/${projectId}/sprints/${sprintId}/status`,
  UPDATE_STORY_STATUS:     (projectId, storyId) =>
    `${API_BASE_URL}/projects/${projectId}/stories/${storyId}/status`,

  // ── Legacy ───────────────────────────────────────────
  GET_SPRINT_STORIES: (sprintId) => `${API_BASE_URL}/stories/${sprintId}`,
  GET_SPRINTS:        `${API_BASE_URL}/sprints`,
};

export default API_ENDPOINTS;
