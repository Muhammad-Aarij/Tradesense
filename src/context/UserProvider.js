import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const {
    userToken,
    userId,
    isSignedIn,
    themeType,
    userObject,
  } = useSelector((state) => state.auth);

  const [contextData, setContextData] = useState({
    token: null,
    id: null,
    theme: 'light',
    isSignedIn: false,
    user: null,
  });

  useEffect(() => {
    if (isSignedIn) {
      setContextData({
        token: userToken,
        id: userId,
        theme: themeType,
        isSignedIn,
        user: userObject,
      });
    }
  }, [isSignedIn, userToken, userId, themeType]);

  return (
    <UserContext.Provider value={contextData}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
