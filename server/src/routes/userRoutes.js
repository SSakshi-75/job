import express from "express";
import { getProfile, updateProfile, uploadProfilePicture, uploadUserResume, getNotifications, markNotificationRead, clearAllNotifications, analyzeUserResume } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { uploadProfilePic, uploadResume } from "../middlewares/upload.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/upload-profile-pic", protect, uploadProfilePic, uploadProfilePicture);
router.post("/upload-resume", protect, uploadResume, uploadUserResume);

// Notifications
router.get("/notifications", protect, getNotifications);
router.put("/notifications/:id/read", protect, markNotificationRead);
router.delete("/notifications", protect, clearAllNotifications);

// AI Resume Analysis
router.post("/analyze-resume", protect, analyzeUserResume);

export default router;
