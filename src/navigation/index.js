import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../components/loader';
import HomeNavigator from './HomeNavigator';
import Mode from '../components/Mode';



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
                <HomeNavigator />
            </NavigationContainer>
            <Mode/>
            {isLoading && <Loader />}
        </>

    );
};

export default AppNavContainer;
