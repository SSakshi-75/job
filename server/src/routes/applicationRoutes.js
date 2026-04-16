import express from "express";
import { 
    applyToJob, 
    getMyApplications, 
    getJobApplicants, 
    updateApplicationStatus,
    getRecruiterApplications 
} from "../controllers/applicationController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply to a job
router.post("/:jobId", protect, authorize("job-seeker"), applyToJob);

// Get applied jobs for current seeker
router.get("/me", protect, authorize("job-seeker"), getMyApplications);

// Get all applications received by the recruiter
router.get("/recruiter", protect, authorize("recruiter"), getRecruiterApplications);

// Get applicants for a specific job (recruiter only)
router.get("/job/:jobId", protect, authorize("recruiter"), getJobApplicants);

// Update application status (recruiter only)
router.put("/:id/status", protect, authorize("recruiter"), updateApplicationStatus);

export default router;
