import express from "express";
import {
    getDashboardStats,
    toggleBanUser,
    deleteJobAdmin,
    getAllUsersAdmin,
    getAllJobsAdmin,
    deleteUserAdmin,
    changeUserRole,
    toggleJobStatus,
    getAllApplicationsAdmin,
    deleteApplicationAdmin,
    getAllInterviewsAdmin,
    deleteInterviewAdmin,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply auth and admin check to all routes in this file
router.use(protect);
router.use(authorize("admin"));

// ── Dashboard ──
router.get("/stats", getDashboardStats);

// ── User Management ──
router.get("/users", getAllUsersAdmin);
router.put("/users/:id/ban", toggleBanUser);
router.put("/users/:id/role", changeUserRole);
router.delete("/users/:id", deleteUserAdmin);

// ── Job Management ──
router.get("/jobs", getAllJobsAdmin);
router.put("/jobs/:id/status", toggleJobStatus);
router.delete("/jobs/:id", deleteJobAdmin);

// ── Application Management ──
router.get("/applications", getAllApplicationsAdmin);
router.delete("/applications/:id", deleteApplicationAdmin);

// ── Interview Management ──
router.get("/interviews", getAllInterviewsAdmin);
router.delete("/interviews/:id", deleteInterviewAdmin);

export default router;
