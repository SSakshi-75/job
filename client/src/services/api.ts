import axios from "axios";

// Create an axios instance
const api = axios.create({
    baseURL: "http://localhost:5000/api", // In production this would be an env variable
    withCredentials: true,
});

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
