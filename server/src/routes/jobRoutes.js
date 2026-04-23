import express from "express";
import {
    createJob,
    getJobs,
    getJob,
    getMyJobs,
    updateJob,
    deleteJob,
    getAIRecommendedJobs,
    analyzeSpecificJobMatch
} from "../controllers/jobController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getJobs);

// AI Services
router.get("/ai/recommendations", protect, authorize("job-seeker"), getAIRecommendedJobs);
router.get("/:id/ai/analyze", protect, authorize("job-seeker"), analyzeSpecificJobMatch);

// Private - Recruiter only
router.post("/", protect, authorize("recruiter", "admin"), createJob);
router.get("/recruiter/my-jobs", protect, authorize("recruiter", "admin"), getMyJobs);

router.get("/:id", getJob);

router.put("/:id", protect, authorize("recruiter", "admin"), updateJob);
router.delete("/:id", protect, authorize("recruiter", "admin", "admin"), deleteJob);

export default router;
