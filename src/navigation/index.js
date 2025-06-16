import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';
import ProfilingNavigator from './ProfilingNavigator';
import Mode from '../components/Mode';
import Loader from '../components/loader';

import { retrieveToken } from '../redux/slice/authSlice';

const AppNavContainer = () => {
    const dispatch = useDispatch();
    const { isSignedIn, userToken, isProfilingDone } = useSelector(state => state.auth);
    const { isLoading } = useSelector(state => state.loader);
    const { isSidebarOpen } = useSelector(state => state.loader);

    useEffect(() => {
        dispatch(retrieveToken());
    }, []);

    const renderNavigator = () => {
        if (isSignedIn && userToken) {
            if (!isProfilingDone) {
                return <ProfilingNavigator />;
            }
            return <HomeNavigator />;
        }
        return <AuthNavigator />;
    };

    return (
        <>
            <NavigationContainer>
                {renderNavigator()}
            </NavigationContainer>
            {/* <Mode /> */}
            {isLoading && <Loader />}
        </>
    );
};

export default AppNavContainer;
