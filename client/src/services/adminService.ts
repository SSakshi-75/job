import api from "./api";

// Get dashboard stats
export const getAdminStats = async () => {
    const res = await api.get("/admin/stats");
    return res.data;
};

// Get all users
export const getAllUsers = async () => {
    const res = await api.get("/admin/users");
    return res.data;
};

// Get all jobs
export const getAllJobs = async () => {
    const res = await api.get("/admin/jobs");
    return res.data;
};

// Ban or unban a user
export const toggleBanUser = async (userId: string) => {
    const res = await api.put(`/admin/users/${userId}/ban`);
    return res.data;
};

// Delete a job
export const deleteJobAdmin = async (jobId: string) => {
    const res = await api.delete(`/admin/jobs/${jobId}`);
    return res.data;
};
