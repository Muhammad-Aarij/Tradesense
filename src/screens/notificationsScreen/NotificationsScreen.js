import React, { useEffect, useState, useContext, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
    ImageBackground,
} from 'react-native';
import moment from 'moment';
import { bell, check, back } from '../../assets/images'; // Use your own icon paths
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { ThemeContext } from '../../context/ThemeProvider';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const dummyNotifications = [
    {
        id: '1',
        title: 'Appointment Approved',
        message: 'Your request for consultation with Dr. Ahsan has been approved.',
        time: '2025-07-16T10:20:00Z',
        read: false,
    },
    {
        id: '2',
        title: 'Affiliate Request Update',
        message: 'Your affiliate request is still pending.',
        time: '2025-07-15T08:10:00Z',
        read: true,
    },
];

const NotificationsScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const navigation = useNavigation();
    const { theme, isDarkMode } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);

    useEffect(() => {
        // Replace with real API if needed
        setNotifications(dummyNotifications);
    }, []);

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, read: true } : item
            )
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, !item.read && styles.unread]}
            onPress={() => markAsRead(item.id)}
            activeOpacity={0.8}
        >
            <LinearGradient
                start={{ x: 0.0, y: 0.95 }}
                end={{ x: 1.0, y: 1.0 }}
                colors={['rgba(0, 0, 0, 0.04)', 'rgba(255, 255, 255, 0)']}
                style={{
                    padding: 16,
                }}
            >

                <View style={styles.cardHeader}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.time}>{moment(item.time).fromNow()}</Text>
                </View>
                <Text style={styles.message}>{item.message}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <ImageBackground source={theme.bg} style={styles.container}>
            <Header title="Notifications" style={{ marginTop: 20 }} />

            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No notifications</Text>
                }
            />
        </ImageBackground>
    );
};

export default NotificationsScreen;

const getStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#F8FAFC',
            padding: 20,
        },
        menuItemContentLinearGradient: {
            flex: 1,

            // alignItems: 'center',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 10,
            justifyContent: 'space-between',
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: '600',
            color: '#111827',
        },
        backIcon: {
            width: 24,
            height: 24,
            resizeMode: 'contain',
        },
        list: {
            // paddingHorizontal: 16,
            paddingBottom: 20,
        },
        card: {
            borderRadius: 12,
            marginBottom: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderWidth: 1,
            borderColor: theme.borderColor,
            borderRadius: 9,
        },

        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        icon: {
            width: 20,
            height: 20,
            marginRight: 8,
            tintColor: '#3B82F6',
        },
        title: {
            fontSize: 13,
            fontFamily: "Inter-Medium",
            color: theme.textColor,
        },
        message: {
            fontSize: 12,
            fontFamily: "Inter-Regular",
            color: theme.subTextColor,
            // marginBottom: 4,
        },
        time: {
            fontSize: 12,
            color: theme.subTextColor,
            textAlign: 'right',
        },
        emptyText: {
            textAlign: 'center',
            marginTop: 60,
            fontSize: 16,
            color: '#9CA3AF',
        },
    });
