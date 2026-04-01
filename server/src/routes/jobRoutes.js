import express from "express";
import {
    createJob,
    getJobs,
    getJob,
    getMyJobs,
    updateJob,
    deleteJob,
} from "../controllers/jobController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getJobs);
router.get("/:id", getJob);

// Private - Recruiter only
router.post("/", protect, authorize("recruiter", "admin"), createJob);
router.get("/recruiter/my-jobs", protect, authorize("recruiter", "admin"), getMyJobs);
router.put("/:id", protect, authorize("recruiter", "admin"), updateJob);
router.delete("/:id", protect, authorize("recruiter", "admin", "admin"), deleteJob);

export default router;
