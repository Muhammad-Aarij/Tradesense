import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { startLoading, stopLoading } from './loaderSlice';

// Thunk: Retrieve data on app start
export const retrieveToken = createAsyncThunk('auth/retrieveToken', async (_, thunkAPI) => {
  try {
    thunkAPI.dispatch(startLoading());

    const [token, userData, theme, profilingFlag] = await Promise.all([
      AsyncStorage.getItem('token'),
      AsyncStorage.getItem('user'),
      AsyncStorage.getItem('themeType'),
      AsyncStorage.getItem('isProfilingDone'),
    ]);

    const user = userData ? JSON.parse(userData) : null;

    const isProfilingDone =
      profilingFlag !== null
        ? JSON.parse(profilingFlag)
        : user?.choosenArea?.length > 0;

    return {
      token: token || null,
      user,
      isProfilingDone,
      themeType: theme || 'light',
    };
  } catch (error) {
    console.error('❌ Error retrieving auth data:', error);
    return {
      token: null,
      user: null,
      isProfilingDone: false,
      themeType: 'light',
    };
  } finally {
    thunkAPI.dispatch(stopLoading());
  }
});

// Thunk: Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ token, user, themeType = 'light' }, thunkAPI) => {
    try {
      thunkAPI.dispatch(startLoading());

      const isProfilingDone = user?.onboarding?.length > 0;

      await AsyncStorage.multiSet([
        ['token', token],
        ['user', JSON.stringify(user)],
        ['themeType', themeType],
        ['isProfilingDone', JSON.stringify(isProfilingDone)],
      ]);

      return {
        token,
        user,
        isProfilingDone,
        themeType,
      };
    } finally {
      thunkAPI.dispatch(stopLoading());
    }
  }
);

// Thunk: Logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, thunkAPI) => {
  try {
    thunkAPI.dispatch(startLoading());
    await AsyncStorage.multiRemove([
      'token',
      'user',
      'themeType',
      'isProfilingDone',
    ]);
  } finally {
    thunkAPI.dispatch(stopLoading());
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoading: true,
    isSignedIn: false,
    isProfilingDone: false,
    userToken: null,
    userId: null,
    userObject: null,
    themeType: 'light',
    isAffiliate: false,
    affiliateCode: null,
  },
  reducers: {
    setTheme: (state, action) => {
      state.themeType = action.payload;
      AsyncStorage.setItem('themeType', action.payload);
    },
    setProfilingDone: (state, action) => {
      state.isProfilingDone = action.payload;
      AsyncStorage.setItem('isProfilingDone', JSON.stringify(action.payload));
    },
    setAffiliateData: (state, action) => {
      const { isAffiliate, affiliateCode } = action.payload;
      state.isAffiliate = isAffiliate;
      state.affiliateCode = affiliateCode;
      // Optionally save to AsyncStorage if needed later
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveToken.fulfilled, (state, action) => {
        const { token, user, isProfilingDone, themeType } = action.payload;

        state.userToken = token;
        state.userObject = user;
        state.userId = user?._id || null;
        state.isSignedIn = !!token && !!user;
        state.isProfilingDone = isProfilingDone;
        state.themeType = themeType;
        state.isAffiliate = user?.isAffiliate || false;
        state.affiliateCode = user?.affiliateCode || null;
        state.isLoading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { token, user, isProfilingDone, themeType } = action.payload;

        state.userToken = token;
        state.userObject = user;
        state.userId = user._id;
        state.isSignedIn = true;
        state.isProfilingDone = isProfilingDone;
        state.themeType = themeType;
        state.isAffiliate = user?.isAffiliate || false;
        state.affiliateCode = user?.affiliateCode || null;
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userToken = null;
        state.userObject = null;
        state.userId = null;
        state.isSignedIn = false;
        state.isProfilingDone = false;
        state.themeType = 'light';
        state.isAffiliate = false;
        state.affiliateCode = null;
        state.isLoading = false;
      });
  },
});

export const { setTheme, setProfilingDone, setAffiliateData } = authSlice.actions;
export default authSlice.reducer;
