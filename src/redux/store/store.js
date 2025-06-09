import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../slice/authSlice.js';
import loaderReducer from "../slice/loaderSlice"; // Import the loader slice

const store = configureStore({
    reducer: {
        // auth: authReducer,
        loader: loaderReducer
    },
});

export default store;
