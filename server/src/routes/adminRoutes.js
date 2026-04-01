import express from "express";
import { getDashboardStats, toggleBanUser, deleteJobAdmin } from "../controllers/adminController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply auth and admin check to all routes in this file
router.use(protect);
router.use(authorize("admin"));

router.get("/stats", getDashboardStats);
router.put("/users/:id/ban", toggleBanUser);
router.delete("/jobs/:id", deleteJobAdmin);

export default router;
