import api from "./api";

// Get current user profile
export const fetchProfile = async () => {
    const res = await api.get("/user/profile");
    return res.data.data;
};

// Update profile fields
export const updateProfile = async (profileData) => {
    const res = await api.put("/user/profile", profileData);
    return res.data.data;
};

// Upload profile picture
export const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    const res = await api.post("/user/upload-profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" } });
    return res.data;
};

// Upload resume PDF
export const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    const res = await api.post("/user/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" } });
    return res.data;
};
