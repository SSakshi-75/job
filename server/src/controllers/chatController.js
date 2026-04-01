import Message from "../models/Message.js";
import User from "../models/User.js";

// @desc    Get chat history between current user and specified receiver
// @route   GET /api/chats/:receiverId
// @access  Private
export const getChatHistory = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const currentUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: receiverId },
                { sender: receiverId, receiver: currentUserId }
            ]
        }).sort({ createdAt: 1 }); // Oldest first for chat UI

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        console.error("Error in getChatHistory:", error);
        res.status(500).json({ success: false, message: "Server error fetching chat history" });
    }
};

// @desc    Get all users the current user has chatted with
// @route   GET /api/chats/conversations/list
// @access  Private
export const getConversationsList = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        // Find distinct user IDs that current user interacted with
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { receiver: currentUserId }]
        });

        const userIds = new Set();
        messages.forEach(msg => {
            if (msg.sender.toString() !== currentUserId.toString()) userIds.add(msg.sender.toString());
            if (msg.receiver.toString() !== currentUserId.toString()) userIds.add(msg.receiver.toString());
        });

        const users = await User.find({ _id: { $in: Array.from(userIds) } })
            .select("name email role profilePicture"); // send basic info

        res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {
        console.error("Error in getConversationsList:", error);
        res.status(500).json({ success: false, message: "Server error fetching conversations" });
    }
}
