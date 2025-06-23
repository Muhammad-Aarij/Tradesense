import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Linking } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';

import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';
import Loader from '../components/loader';
import { retrieveToken } from '../redux/slice/authSlice';
import CourseDeepLink from '../screens/Courses/courseDetail/CourseDeepLink';
import LoginScreen from '../screens/Auth/loginScreen/LoginScreen';
import SignUp from '../screens/Auth/SignUp/SignUp';
import PlansScreenDeepLink from '../screens/Courses/Plans/PlansScreenDeepLink';
import MenuComponent from '../components/MenuComponent';

const RootStack = createNativeStackNavigator();

const MainFlow = () => {
    const { isSignedIn, userToken, isProfilingDone } = useSelector(state => state.auth);
    if (isSignedIn && userToken) {
        return isProfilingDone ? <HomeNavigator /> : <AuthNavigator />;
    }
    return <AuthNavigator />;
};

const AppNavContainer = () => {
    const dispatch = useDispatch();
    const navigationRef = useNavigationContainerRef();
    const [isAppReady, setIsAppReady] = useState(false);
    const [initialUrl, setInitialUrl] = useState(null); // New state to hold the pending URL
    const { isLoading } = useSelector(state => state.loader);
    const { isSidebarOpen } = useSelector(state => state.loader);

    useEffect(() => {
        const initApp = async () => {
            await dispatch(retrieveToken());
            const url = await Linking.getInitialURL();
            if (url) setInitialUrl(url); // Save for later navigation
            setIsAppReady(true);
        };
        initApp();
    }, []);

    useEffect(() => {
        const handleDeepLink = (url) => {
            try {
                const parsed = new URL(url);
                const token = parsed.searchParams.get('token');
                const pathParts = parsed.pathname.split('/');
                const courseId = pathParts[2];

                if (!isSignedIn || !userToken) {
                    // Store for post-auth navigation
                    setPendingDeepLink({ courseId, token });
                    navigationRef.current?.navigate('SignInModal');
                } else {
                    navigationRef.current?.navigate('CourseDeepLink', { courseId, affiliateToken: token });
                }
            } catch (err) {
                console.warn('Invalid deep link', err);
            }
        };

        const subscription = Linking.addEventListener('url', ({ url }) => {
            handleDeepLink(url);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const linking = {
        prefixes: ['tradesense://'],
        config: {
            screens: {
                CourseDeepLink: 'course/:courseId',
                MainFlow: {
                    screens: {
                        HomeNavigator: {
                            screens: {},
                        },
                    },
                },
            },
        },
    };

    if (!isAppReady) {
        return null;
    }

    return (
        <>
            <NavigationContainer
                ref={navigationRef}
                linking={linking}
                onReady={() => {
                    if (initialUrl) {
                        // Handle the deep link only once when app is ready
                        try {
                            const parsed = new URL(initialUrl);
                            const token = parsed.searchParams.get('token');
                            const pathParts = parsed.pathname.split('/');
                            const courseId = pathParts.length >= 3 ? pathParts[2] : null;

                            if (token && courseId) {
                                navigationRef.current?.navigate('CourseDeepLink', {
                                    courseId,
                                    affiliateToken: token,
                                });
                            }
                        } catch (e) {
                            console.warn("Failed to parse deep link", e);
                        }
                    }
                }}
            >
                <RootStack.Navigator screenOptions={{ headerShown: false }}>
                    <RootStack.Screen name="MainFlow" component={MainFlow} />
                    <RootStack.Screen name="CourseDeepLink" component={CourseDeepLink} />
                    <RootStack.Screen name="SignInModal" component={LoginScreen} options={{ presentation: 'modal' }} />
                    <RootStack.Screen name="SignUpModal" component={SignUp} options={{ presentation: 'modal' }} />
                    <RootStack.Screen name="PlansScreenDeepLink" component={PlansScreenDeepLink} />
                </RootStack.Navigator>

                {isSidebarOpen && <MenuComponent />}
            </NavigationContainer>
            {isLoading && <Loader />}
        </>
    );
};

export default AppNavContainer;
