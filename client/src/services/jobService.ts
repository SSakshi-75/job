import api from "./api";

// Get all jobs (public, with filters)
export const getJobs = async (params = {}) => {
    const res = await api.get("/jobs", { params });
    return res.data;
};

// Get single job
export const getJobById = async (id: string) => {
    const res = await api.get(`/jobs/${id}`);
    return res.data.data;
};

// Get recruiter's own jobs
export const getMyJobs = async () => {
    const res = await api.get("/jobs/recruiter/my-jobs");
    return res.data;
};

// Create a new job
export const createJob = async (jobData: object) => {
    const res = await api.post("/jobs", jobData);
    return res.data.data;
};

// Update a job
export const updateJob = async (id: string, jobData: object) => {
    const res = await api.put(`/jobs/${id}`, jobData);
    return res.data.data;
};

// Delete a job
export const deleteJob = async (id: string) => {
    const res = await api.delete(`/jobs/${id}`);
    return res.data;
};
