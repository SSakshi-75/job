import express from "express";
import { scheduleInterview, getRecruiterInterviews, getApplicantInterviews, updateInterview } from "../controllers/interviewController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("recruiter"), scheduleInterview);
router.get("/my-scheduled", protect, authorize("recruiter"), getRecruiterInterviews);
router.get("/my-interviews", protect, authorize("job-seeker"), getApplicantInterviews);
router.put("/:id", protect, authorize("recruiter"), updateInterview);

export default router;
