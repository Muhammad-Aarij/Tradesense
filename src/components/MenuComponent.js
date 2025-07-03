import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Image, Dimensions, BackHandler, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { closeSidebar } from '../redux/slice/loaderSlice';
import { logoutUser } from '../redux/slice/authSlice'; // Assuming loginUser is not used here directly
import theme from '../themes/theme';
// Get screen height for modal positioning/sizing
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const MenuComponent = ({ visible, }) => { // Removed 'onClose' prop as it's handled by dispatch(closeSidebar())
    const scrollRef = useRef(null);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (visible && scrollRef.current) {
            // Scroll to top when sidebar becomes visible
            // Use setTimeout to ensure layout is measured, especially on Android
            setTimeout(() => {
                scrollRef.current?.scrollTo({ y: 0, animated: false });
            }, 100);
        }

        const backAction = () => {
            if (visible) {
                dispatch(closeSidebar());
                return true; // Indicate that we handled the back press
            }
            return false; // Let default back press behavior occur
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove(); // Clean up the event listener
    }, [visible, dispatch]); // Added dispatch to dependency array

    const navigateTo = (screen, stack) => {
        dispatch(closeSidebar());
        if (stack) {
            navigation.navigate(stack, {
                screen: screen,
            });
        } else {
            navigation.navigate(screen);
        }
    };

    const handleCloseSidebar = () => { // Renamed onClose to be more descriptive and avoid prop clash
        dispatch(closeSidebar());
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={handleCloseSidebar} // Use the local handler
            animationType="fade" // Added fade animation for smoother transition
        >
            <TouchableOpacity // Make the overlay outside the menu close the sidebar
                style={styles.modalOverlay}
                activeOpacity={1} // Keep activeOpacity at 1 to prevent visual feedback on press
                onPress={handleCloseSidebar}
            >
                <View style={styles.menuWrapper}>
                    <ScrollView
                        ref={scrollRef}
                        style={styles.scrollView} // Apply style to ScrollView itself
                        contentContainerStyle={styles.scrollViewContent} // Keep this for content specific styling
                        showsVerticalScrollIndicator={true}
                    >
                        {/* Ensure menuContainer adapts to content and is correctly positioned */}
                        <View style={styles.menuContainer}>
                            <TouchableOpacity>
                                <Text style={styles.sectionTitle}>Trader365</Text>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Text style={styles.sectionTitle}>Courses</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItemWithKey} onPress={() => { navigateTo("OurCoursesScreen", "Courses") }}>
                                <Text style={styles.menuItem}>Our Courses</Text>
                                {/* Removed key Image here as it was not defined or used in the original problem context */}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItemWithKey} onPress={() => { navigateTo("PurchasedCoursesScreen", "Courses") }}>
                                <Text style={styles.menuItem}>Purchased Courses</Text>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Text style={styles.sectionTitle}>Affiliate</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItemWithKey} onPress={() => { navigateTo("AffiliateCoursesScreen", "Affiliate") }}>
                                <Text style={styles.menuItem}>Courses</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItemWithKey} onPress={() => { navigateTo("AffiliateDashboardScreen", "Affiliate") }}>
                                <Text style={styles.menuItem}>Analytics</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItemWithKey} onPress={() => { navigateTo("WithdrawScreen", "Affiliate") }}>
                                <Text style={styles.menuItem}>Withdraw Money</Text>
                            </TouchableOpacity>

                            {/* <TouchableOpacity>
                                <Text style={styles.sectionTitle}>Pillars</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItemWithKey} onPress={() => { navigateTo("PillarsCategoryScreen", "Pillars") }}>
                                <Text style={styles.menuItem}>Education</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItemWithKey} onPress={() => { navigateTo("PsychologyCategoryScreen", "Pillars") }}>
                                <Text style={styles.menuItem}>Psychology</Text>
                            </TouchableOpacity> */}

                            <TouchableOpacity>
                                <Text style={styles.sectionTitle}>Accountability</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItemWithKey} onPress={() => { navigateTo("Acc_Stocks", "Accountability") }}>
                                <Text style={styles.menuItem}>Analytics</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItemWithKey} onPress={() => { navigateTo("WithdrawScreen", "Accountability") }}>
                                <Text style={styles.menuItem}>Trading</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItemWithKey} onPress={() => {
                                navigation.navigate("Accountability", {
                                    screen: "AccountabilityPartner",
                                });
                            }}>
                                <Text style={styles.menuItem}>Accountability Partner</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItemWithKey} onPress={() => { navigateTo("ChatScreen") }}>
                                <Text style={styles.menuItem}>Chat</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItemWithKey} onPress={() => { navigateTo("Gamification", "Accountability") }}>
                                <Text style={styles.menuItem}>Gamification Reward </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItemWithKey} onPress={() => dispatch(logoutUser())}>
                                <Text style={styles.menuItem}>Logout</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleCloseSidebar} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Close </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim the background
        justifyContent: 'flex-start', // Align menu to the start (left for LTR)
        flexDirection: 'row', // Important for horizontal positioning of the menu
    },
    menuWrapper: {
        width: 250, // Fixed width for the menu as per your original design
        backgroundColor: theme.darkBlue, // Use theme color
        height: '100%', // Make menu wrapper take full height of the modal
        paddingHorizontal: 10,
        // Remove borderRadius and other properties that should be on the ScrollView or its content
    },
    scrollView: {
        flex: 1, // Allow ScrollView to take all available height within menuWrapper
        // backgroundColor: 'red', // For debugging: you should see the scrollable area
    },
    scrollViewContent: {
        // This is for content padding/alignment *inside* the scroll view
        paddingBottom: 20, // Add some padding at the bottom of the scrollable content
    },
    menuContainer: {
        // This view acts as the container for all menu items.
        // It's the direct child of ScrollView's contentContainerStyle.
        // No fixed height here, let content dictate height.
    },
    sectionTitle: {
        alignSelf: "flex-start",
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        marginTop: 20,
        marginBottom: 5,
        marginLeft: 15,
        color: "white",
    },
    menuItem: {
        padding: 11,
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: "white",
    },
    menuItemWithKey: {
        marginVertical: 6,
        borderRadius: 10,
        marginHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9,
        borderColor: theme.borderColor,
        borderRadius: 8,
        alignItems: "center",
    },
    key: { // Keep the key style for completeness if you add the image back
        width: 16,
        height: 16,
        resizeMode: 'contain',
    },
    closeButton: {
        marginVertical: 20,
        paddingVertical: 6,
        paddingHorizontal: 40,
        backgroundColor: theme.primaryColor,
        borderRadius: 5,
        alignSelf: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 14,
    },
});

export default MenuComponent;