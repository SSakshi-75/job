import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: localStorage.getItem("theme") || "light" };

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem("theme", action.payload);
            document.documentElement.setAttribute("data-theme", action.payload);
            if (action.payload === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        } } });

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
