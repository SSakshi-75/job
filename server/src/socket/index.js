import { Server } from "socket.io";
import Message from "../models/Message.js";

// Map to keep track of User ID -> Socket ID
const connectedUsers = new Map();

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`New socket connection: ${socket.id}`);

        // Register user when they log in or open the app
        socket.on("register_user", (userId) => {
            if (userId) {
                connectedUsers.set(userId, socket.id);
                console.log(`User ${userId} registered with socket ${socket.id}`);
                // Optional: broadcast online status to everyone
                io.emit("update_online_users", Array.from(connectedUsers.keys()));
            }
        });

        // Listen for new chat messages
        socket.on("send_message", async (data) => {
            const { senderId, receiverId, content } = data;

            try {
                // Save the message to MongoDB immediately
                const savedMessage = await Message.create({
                    sender: senderId,
                    receiver: receiverId,
                    content
                });

                // Check if receiver is online
                const receiverSocketId = connectedUsers.get(receiverId);
                
                // If online, force a real-time emit to the specific socket
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", savedMessage);
                }

                // Emit back to sender as confirmation (so their UI updates cleanly with MongoDB _id)
                socket.emit("message_sent_success", savedMessage);

            } catch (error) {
                console.error("Socket error processing message:", error);
                socket.emit("message_error", { error: "Failed to send message" });
            }
        });

        // Handle disconnect cleanup
        socket.on("disconnect", () => {
            let disconnectedUserId = null;
            for (const [userId, socketId] of connectedUsers.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    connectedUsers.delete(userId);
                    break;
                }
            }
            if (disconnectedUserId) {
                console.log(`User ${disconnectedUserId} disconnected.`);
                io.emit("update_online_users", Array.from(connectedUsers.keys()));
            }
        });
    });

    return io;
};
