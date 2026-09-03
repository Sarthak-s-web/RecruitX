import api from "./api";

export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  refresh: () => api.post("/auth/refresh"),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/users/profile"),
};

export const jobService = {
  getAll: (params) => api.get("/jobs", { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  getMy: () => api.get("/jobs/my"),
  create: (data) => api.post("/jobs", data),
  update: (id, data) => api.patch(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

export const applicationService = {
  apply: (jobId, formData) =>
    api.post(`/application/${jobId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getByJob: (jobId) => api.get(`/application/job/${jobId}`),
  getMy: () => api.get("/application/my"),
  updateStatus: (applicationId, status) =>
    api.patch(`/application/${applicationId}/status`, { status }),
  getDashboard: () => api.get("/application/dashboard"),
};

export const userService = {
  getProfile: () => api.get("/users/profile"),
};
