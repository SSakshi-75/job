import api from "./api";

// ── Dashboard ──
export const getAdminStats = async () => {
    const res = await api.get("/admin/stats");
    return res.data;
};

// ── Users ──
export const getAllUsers = async () => {
    const res = await api.get("/admin/users");
    return res.data;
};

export const toggleBanUser = async (userId) => {
    const res = await api.put(`/admin/users/${userId}/ban`);
    return res.data;
};

export const changeUserRole = async (userId, role) => {
    const res = await api.put(`/admin/users/${userId}/role`, { role });
    return res.data;
};

export const deleteUserAdmin = async (userId) => {
    const res = await api.delete(`/admin/users/${userId}`);
    return res.data;
};

// ── Jobs ──
export const getAllJobs = async () => {
    const res = await api.get("/admin/jobs");
    return res.data;
};

export const toggleJobStatus = async (jobId) => {
    const res = await api.put(`/admin/jobs/${jobId}/status`);
    return res.data;
};

export const deleteJobAdmin = async (jobId) => {
    const res = await api.delete(`/admin/jobs/${jobId}`);
    return res.data;
};

// ── Applications ──
export const getAllApplicationsAdmin = async () => {
    const res = await api.get("/admin/applications");
    return res.data;
};

export const deleteApplicationAdmin = async (appId) => {
    const res = await api.delete(`/admin/applications/${appId}`);
    return res.data;
};

// ── Interviews ──
export const getAllInterviewsAdmin = async () => {
    const res = await api.get("/admin/interviews");
    return res.data;
};

export const deleteInterviewAdmin = async (interviewId) => {
    const res = await api.delete(`/admin/interviews/${interviewId}`);
    return res.data;
};
