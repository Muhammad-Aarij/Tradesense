import React, { createContext, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout } from '../redux/slice/authSlice';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();

    const authContext = useMemo(() => ({
        signIn: async (email, tokenId) => {
            dispatch(login({ userName: email, userToken: tokenId }));
        },
        signOut: async () => {
            dispatch(logout());
        },
    }), []);

    return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
