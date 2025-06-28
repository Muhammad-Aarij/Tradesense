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
    console.log("isProfilingDone",isProfilingDone)
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
                const token = parsed.searchParams.get('token');
                const pathParts = parsed.pathname.split('/');
                const courseId = pathParts.length >= 3 ? pathParts[2] : null;

                // Check if navigationRef is available before attempting to navigate
                if (navigationRef.current) {
                    if (!isSignedIn || !userToken) {
                        // Store pending deep link if user is not signed in
                        // You'll need a state variable like `pendingDeepLink` in your Redux auth slice or a global state
                        // For now, navigating to SignInModal. You'd typically store `courseId` and `token` globally
                        // and then navigate after successful login.
                        console.log('User not signed in, navigating to SignInModal for deep link handling post-auth.');
                        navigationRef.current?.navigate('SignInModal', {
                            // You might pass params to the LoginScreen to re-route after login
                            // e.g., redirectRoute: 'CourseDeepLink', redirectParams: { courseId, affiliateToken: token }
                        });
                    } else if (token && courseId) {
                        navigationRef.current?.navigate('CourseDeepLink', { courseId, affiliateToken: token });
                    } else if (parsed.hostname === 'plans' && parsed.pathname === '/deeplink') { // Example for PlansScreenDeepLink
                        // Example: tradesense://plans/deeplink?someParam=value
                        navigationRef.current?.navigate('PlansScreenDeepLink', { /* any plans related params */ });
                    }
                    // Add other deep link parsing logic here if needed
                }
            } catch (err) {
                console.warn('Invalid deep link handled by listener:', err);
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
                // Ensure these screen names match your RootStack.Navigator screen names
                CourseDeepLink: 'course/:courseId',
                PlansScreenDeepLink: 'plans/deeplink', // Example path for Plans deep link
                SignInModal: 'signin', // Optional: if you want a deep link directly to sign in modal
                SignUpModal: 'signup', // Optional: if you want a deep link directly to sign up modal
                // MainFlow's screens are managed by its own navigators, so they are not direct root stack screens for deep linking
                // You would typically link to a specific screen *within* MainFlow, e.g.,
                // HomeNavigator: { initialRouteName: 'BottomTabs', screens: { Home: 'home', Courses: 'courses', ... } }
                // For direct links into deeply nested navigators, you might define nested paths here:
                MainFlow: {
                    screens: {
                        HomeNavigator: {
                            screens: {
                                BottomTabs: {
                                    screens: {
                                        Home: 'home', // tradesense://home
                                        Courses: {
                                            screens: {
                                                OurCoursesScreen: 'courses/list', // tradesense://courses/list
                                                PurchasedCoursesScreen: 'courses/purchased', // tradesense://courses/purchased
                                                CourseDetailScreen: 'course/:courseId', // This conflicts with root level, choose one or refine
                                            }
                                        },
                                        Accountability: {
                                            screens: {
                                                AccountabilityPartner: 'accountability/partner', // tradesense://accountability/partner
                                                ChatScreen: 'accountability/chat', // tradesense://accountability/chat
                                                GamificationRewardsScreen: 'accountability/gamification', // tradesense://accountability/gamification
                                            }
                                        },
                                        // ... other tabs
                                    }
                                }
                            }
                        }
                    }
                }
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
