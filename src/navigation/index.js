import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import { useSelector, useDispatch } from 'react-redux';
// import { retrieveToken } from '../redux/slice/authSlice';

import AuthNavigator from './AuthNavigator';
// import AuthProvider from '../context/AuthProvider';

const AppNavContainer = () => {
    // const { isLoading, userToken } = useSelector(state => state.auth);
    // const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(retrieveToken());
    // }, []);

    // if (isLoading) {
    //     return (
    //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //             <ActivityIndicator size="large" />
    //         </View>
    //     );
    // }

    return (
        // <AuthProvider>
        <NavigationContainer>
            <AuthNavigator />
            {/* {userToken ? <BottomTabs /> : <AuthNavigator />} */}
        </NavigationContainer>
        // </AuthProvider>
    );
};

export default AppNavContainer;
