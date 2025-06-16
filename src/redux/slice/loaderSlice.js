import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
    name: "loader",
    initialState: { isLoading: false, isSidebarOpen: false },
    reducers: {
        startLoading: (state) => {
            state.isLoading = true;
        },
        stopLoading: (state) => {
            state.isLoading = false;
        },
        openSidebar: (state) => {
            state.isSidebarOpen = true;
        },
        closeSidebar: (state) => {
            state.isSidebarOpen = false;
        }
    }
});

export const { startLoading, stopLoading, openSidebar, closeSidebar } = loaderSlice.actions;
export default loaderSlice.reducer;
