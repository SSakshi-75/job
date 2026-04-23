import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";





export const fetchNotifications = createAsyncThunk(
    "notifications/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/user/notifications");
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const markAsRead = createAsyncThunk(
    "notifications/markRead",
    async (id, { rejectWithValue }) => {
        try {
            await api.put(`/user/notifications/${id}/read`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const clearAllNotifications = createAsyncThunk(
    "notifications/clearAll",
    async (_, { rejectWithValue }) => {
        try {
            await api.delete("/user/notifications");
            return;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false };

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            if (!action.payload.read) state.unreadCount++;
        } },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter((n) => !n.read).length;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const notification = state.notifications.find((n) => n._id === action.payload);
                if (notification && !notification.read) {
                    notification.read = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(clearAllNotifications.fulfilled, (state) => {
                state.notifications = [];
                state.unreadCount = 0;
            });
    } });

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
