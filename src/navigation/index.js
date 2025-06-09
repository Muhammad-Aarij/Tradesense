import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { retrieveToken } from '../redux/slice/authSlice';
// import AuthProvider from '../context/AuthProvider';
import AuthNavigator from './AuthNavigator';
import { useSelector } from 'react-redux';
import AnimatedLoader from "react-native-animated-loader";
import { ActivityIndicator, Text } from 'react-native';
import Loader from '../components/loader';



const AppNavContainer = () => {

    const isLoading = useSelector((state) => state.loader.isLoading);
    // const { isLoading, userToken } = useSelector(state => state.auth);
    // const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(retrieveToken());
    // }, []);

    // if (true) {
    //     return (
    //         <Loader/>
    //     );
    // }

    return (
        <>
            <NavigationContainer>
                <AuthNavigator />
            </NavigationContainer>
            {isLoading && <Loader />}
        </>

    );
};

export default AppNavContainer;
