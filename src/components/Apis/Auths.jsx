// src/api/apiEndpoints.js

 const API_BASE_URL = "https://sprint-backend-73ho.onrender.com"; 
// const API_BASE_URL = "http://127.0.0.1:8000";// base only, not /api/v1 here
const API_ENDPOINTS = {
  PROCESS_SPRINT: `${API_BASE_URL}/process-sprint`,
  GET_SPRINT_STORIES: (sprintId) => `${API_BASE_URL}/stories/${sprintId}`,
  GET_SPRINTS: `${API_BASE_URL}/sprints`,
//   PROCESS_SPRINT: `${API_BASE_URL}/process-sprint`,
  // other endpoints...
};

export default API_ENDPOINTS;
