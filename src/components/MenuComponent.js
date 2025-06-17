import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Image, Dimensions } from 'react-native';
import theme from '../themes/theme';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useDispatch } from 'react-redux';
import { closeSidebar } from '../redux/slice/loaderSlice';
import { useRef } from 'react';
import { loginUser, logoutUser } from '../redux/slice/authSlice';


const MenuComponent = ({ visible, }) => {
    const scrollRef = useRef(null);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (visible && scrollRef.current) {
            scrollRef.current.scrollTo({ y: 0, animated: false });
        }

        const backAction = () => {
            if (visible) {
                dispatch(closeSidebar());
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [visible]);

    const navigateTo = (screen, stack) => {
        if (stack) {
            dispatch(closeSidebar()); // Dispatch action to close sidebar
            navigation.navigate(stack, { screen });
        } else {
            navigation.navigate(screen);
        }
    }


    const onClose = () => {
        dispatch(closeSidebar()); // Dispatch action to close sidebar
    }

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <ScrollView
                    ref={scrollRef}
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={true}
                >

                    <View style={styles.menuContainer}>
                        <TouchableOpacity>
                            <Text style={styles.sectionTitle}>Trader 365</Text>
                        </TouchableOpacity>


                        <TouchableOpacity>
                            <Text style={styles.sectionTitle}>Courses</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItemWithKey} onPress={() => { navigateTo("OurCoursesScreen", "Courses") }}>
                            <Text style={styles.menuItem}>Our Courses</Text>
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

                        <TouchableOpacity>
                            <Text style={styles.sectionTitle}>Pillars</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItemWithKey} onPress={() => { navigateTo("PillarsCategoryScreen", "Pillars") }}>
                            <Text style={styles.menuItem}>Education</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItemWithKey} onPress={() => { navigateTo("PsychologyCategoryScreen", "Pillars") }}>
                            <Text style={styles.menuItem}>Psychology</Text>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Text style={styles.sectionTitle}>Accountability</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItemWithKey} onPress={() => { navigateTo("Acc_Stocks", "Accountability") }}>
                            <Text style={styles.menuItem}>Analytics</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItemWithKey} onPress={() => { navigateTo("WithdrawScreen", "Accountability") }}>
                            <Text style={styles.menuItem}>Trading</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItemWithKey} onPress={() => { navigateTo("AccountabilityPartner", "Accountability") }}>
                            <Text style={styles.menuItem}>Accountability Partner</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItemWithKey} onPress={() => { navigateTo("ChatScreen", "Accountability") }}>
                            <Text style={styles.menuItem}>Chat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItemWithKey} onPress={() => { navigateTo("Gamification", "Accountability") }}>
                            <Text style={styles.menuItem}>Gamification Reward </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItemWithKey} onPress={() => dispatch(logoutUser())}>
                            <Text style={styles.menuItem}>Logout</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '100%',
        flexDirection: 'row',
    },
    scrollViewContent: {

    },
    menuContainer: {
        width: 250,
        backgroundColor: theme.darkBlue,
        paddingHorizontal: 10,
    },

    sectionTitle: {
        alignSelf: "flex-start",
        fontSize: 14, // Static font size
        fontFamily: 'Inter-Medium',
        marginTop: 20,
        marginBottom: 5,
        marginLeft: 15,
        color: "white",
    },
    menuItem: {
        // paddingVertical
        padding: 11, // Static padding
        fontFamily: 'Inter-Regular ',
        fontSize: 12, // Static font size
        color: "white",
        // backgroundColor:"black",
    },
    menuItemWithKey: {
        // backgroundColor : theme.primaryColor,
        marginVertical: 6,
        borderRadius: 10,
        marginHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9, borderColor: theme.borderColor,
        borderRadius: 8,
        alignItems: "center",
    },
    key: {
        width: 16, // Static image width
        height: 16, // Static image height
        resizeMode: 'contain',
    },
    closeButton: {
        marginVertical: 20,
        // width:"0%", 
        paddingVertical: 6,
        paddingHorizontal: 40,
        backgroundColor: theme.primaryColor,
        borderRadius: 5,
        alignSelf: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 14, // Static font size
    },
});

export default MenuComponent;
