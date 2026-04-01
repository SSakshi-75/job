import express from "express";
import { getChatHistory, getConversationsList } from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect); // Ensure user is logged in for all chat routes

// GET all users interacted with
router.get("/conversations/list", getConversationsList);

// GET chat history with specific user
router.get("/:receiverId", getChatHistory);

export default router;
