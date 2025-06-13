import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../components/loader';
import Mode from '../components/Mode';
import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import PillarNavigator from './PillarNavigator';
import HomeNavigator from './HomeNavigator';



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
            {/* <Mode /> */}
            {isLoading && <Loader />}
        </>

    );
};

export default AppNavContainer;
