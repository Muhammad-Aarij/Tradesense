import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';
import ProfilingNavigator from './ProfilingNavigator'; // 👈 import your profiling stack
import Mode from '../components/Mode';
import Loader from '../components/loader';

import { retrieveToken } from '../redux/slice/authSlice';

const AppNavContainer = () => {
    const dispatch = useDispatch();
    const { isSignedIn, isLoading, userToken, isProfilingDone } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(retrieveToken());
    }, []);

    const renderNavigator = () => {
        if (isSignedIn && userToken) {
            if (!isProfilingDone) {
                return <ProfilingNavigator />; // 👈 go through profiling flow
            }
            return <HomeNavigator />; // 👈 go to main app
        }
        return <AuthNavigator />; // 👈 not signed in
    };

    return (
        <>
            <NavigationContainer>
                {renderNavigator()}
            </NavigationContainer>
            <Mode />
            {isLoading && <Loader />}
        </>
    );
};

export default AppNavContainer;
