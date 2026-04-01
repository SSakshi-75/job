import api from "./api";

// Apply for a job (Seeker)
export const applyForJob = async (jobId: string) => {
    const res = await api.post(`/applications/${jobId}`);
    return res.data;
};

// Get applied jobs (Seeker)
export const getMyApplications = async () => {
    const res = await api.get("/applications/me");
    return res.data;
};

// Get applicants for a job (Recruiter)
export const getJobApplicants = async (jobId: string) => {
    const res = await api.get(`/applications/job/${jobId}`);
    return res.data;
};

// Update application status (Recruiter)
export const updateApplicationStatus = async (id: string, status: string) => {
    const res = await api.put(`/applications/${id}/status`, { status });
    return res.data;
};
