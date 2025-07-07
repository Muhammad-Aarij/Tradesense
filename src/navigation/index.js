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
import SplashScreen from '../screens/splashScreen/SplashScreen';

const RootStack = createNativeStackNavigator();

const MainFlow = () => {
    const { isSignedIn, userToken, isProfilingDone } = useSelector(state => state.auth);
    // console.log("isProfilingDone",isProfilingDone)
    if (isSignedIn && userToken) {
        return isProfilingDone ? <HomeNavigator /> : <AuthNavigator />;
    }
    return <AuthNavigator />;
};

const AppNavContainer = () => {
    const dispatch = useDispatch();
    const navigationRef = useNavigationContainerRef();
    const [isAppReady, setIsAppReady] = useState(false);
    const [showSplash, setShowSplash] = useState(true); // New state to control splash screen visibility
    const [initialUrl, setInitialUrl] = useState(null);
    const { isLoading } = useSelector(state => state.loader);
    const { isSidebarOpen } = useSelector(state => state.loader);
    const { isSignedIn, userToken } = useSelector(state => state.auth); // Added for deep link auth check

    useEffect(() => {
        const initAppAndSplash = async () => {

            const tokenPromise = dispatch(retrieveToken());

            const splashTimerPromise = new Promise(resolve => setTimeout(resolve, 4000)); // 2 seconds

            // Wait for both to complete
            await Promise.all([tokenPromise, splashTimerPromise]);

            // After both are done, handle initial deep link and set app ready
            const url = await Linking.getInitialURL();
            if (url) {
                setInitialUrl(url);
            }

            setShowSplash(false); // Hide splash screen
            setIsAppReady(true); // Mark app as ready for navigation
        };
        initAppAndSplash();
    }, [dispatch]); // Added dispatch to dependency array as it's from Redux

    useEffect(() => {
        // This useEffect handles subsequent deep links and the initialUrl AFTER the app is ready
        if (!isAppReady) return; // Only run once app is ready to prevent issues

        const handleDeepLink = (url) => {
            try {
                const parsed = new URL(url);
                const courseId = parsed.pathname.split('/').pop(); // e.g., affiliate/course/xyz123
                const affiliateCode = parsed.searchParams.get('affiliateCode');

                if (navigationRef.current) {
                    if (!isSignedIn || !userToken) {
                        navigationRef.current.navigate('SignInModal', {
                            pendingDeepLink: { courseId, affiliateCode }
                        });
                    } else {
                        navigationRef.current.navigate('CourseDeepLink', {
                            courseId,
                            affiliateCode
                        });
                    }
                }
            } catch (err) {
                console.warn('Invalid deep link:', err);
            }
        };

        // Handle the initial URL if it exists (once app is ready)
        // This is crucial because `Linking.getInitialURL()` might resolve *before* NavigationContainer is fully mounted.
        if (initialUrl) {
            handleDeepLink(initialUrl);
            setInitialUrl(null); // Clear initialUrl after handling
        }

        const subscription = Linking.addEventListener('url', ({ url }) => {
            handleDeepLink(url);
        });

        return () => {
            subscription.remove();
        };
    }, [isAppReady, initialUrl, navigationRef, isSignedIn, userToken]); // Added initialUrl and auth state to deps

    const linking = {
        prefixes: ['tradesense://'],
        config: {
            screens: {
                CourseDeepLink: 'affiliate/course/:courseId', // ✅ renamed path
                PlansScreenDeepLink: 'plans/deeplink',
                SignInModal: 'signin',
                SignUpModal: 'signup',
                MainFlow: {
                    screens: {
                        HomeNavigator: {
                            screens: {
                                BottomTabs: {
                                    screens: {
                                        Home: 'home',
                                        Courses: {
                                            screens: {
                                                OurCoursesScreen: 'courses/list',
                                                PurchasedCoursesScreen: 'courses/purchased',
                                                CourseDetailScreen: 'course/:courseId', // ✅ no change here
                                            },
                                        },
                                        Accountability: {
                                            screens: {
                                                AccountabilityPartner: 'accountability/partner',
                                                ChatScreen: 'accountability/chat',
                                                GamificationRewardsScreen: 'accountability/gamification',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    };



    if (showSplash) {
        return <SplashScreen />;
    }

    return (
        <>
            <NavigationContainer
                ref={navigationRef}
                linking={linking}
            // onReady is no longer needed for initialUrl handling as it's done in useEffect
            >
                <RootStack.Navigator screenOptions={{ headerShown: false }}>
                    {/* SplashScreen is handled by conditional rendering outside NavigationContainer */}
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
