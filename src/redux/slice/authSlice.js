// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Thunk to retrieve token from AsyncStorage
// export const retrieveToken = createAsyncThunk('auth/retrieveToken', async () => {
//     try {
//         const token = await AsyncStorage.getItem('token');
//         return token || null;
//     } catch (error) {
//         console.error("Error retrieving token:", error);
//         return null;
//     }
// });

// const authSlice = createSlice({
//     name: 'auth',
//     initialState: {
//         isLoading: true,
//         userToken: null,
//         userName: null,
//     },
//     reducers: {
//         login: (state, action) => {
//             state.userName = action.payload.userName;
//             state.userToken = action.payload.userToken;
//             state.isLoading = false;
//             AsyncStorage.setItem('token', action.payload.userToken);
//         },
//         logout: (state) => {
//             state.userName = null;
//             state.userToken = null;
//             state.isLoading = false;
//             AsyncStorage.removeItem('token');
//         },
//     },
//     extraReducers: (builder) => {
//         builder.addCase(retrieveToken.fulfilled, (state, action) => {
//             state.userToken = action.payload;
//             state.isLoading = false;
//         });
//     },
// });

// export const { login, logout } = authSlice.actions;
// export default authSlice.reducer;
