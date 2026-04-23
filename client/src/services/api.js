import axios from "axios";

// Create an axios instance
export const SERVER_URL = import.meta.env.VITE_SERVER_URL || "https://job-swart.vercel.app";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || `${SERVER_URL}/api`,
    withCredentials: true });

// Request interceptor to add token if it exists (using cookies usually, but we can also store in localStorage)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
