import api from "./api";

// Get list of users the current user has chatted with
export const getConversationsList = async () => {
    const res = await api.get("/chats/conversations/list");
    return res.data;
};

// Get chat history with a specific user
export const getChatHistory = async (receiverId) => {
    const res = await api.get(`/chats/${receiverId}`);
    return res.data;
};
