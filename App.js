import React, { useEffect } from 'react';
import store from './src/redux/store/store';
import { Provider } from 'react-redux';
import AppNavContainer from './src/navigation';
import { API_URL, GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID } from "@env";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const App = () => {

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: GOOGLE_WEB_CLIENT_ID,
            iosClientId: GOOGLE_IOS_CLIENT_ID,
            scopes: ['profile', 'email'],
        });

    }, []);

    return (
        <Provider store={store}>
            <AppNavContainer />
        </Provider>
    );
};

export default App;