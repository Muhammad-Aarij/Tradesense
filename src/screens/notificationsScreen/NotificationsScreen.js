import React, { useContext, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator
} from 'react-native';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useQuery } from '@tanstack/react-query';

import { ThemeContext } from '../../context/ThemeProvider';
import Header from '../../components/Header';
import { getUserNotifications } from '../../functions/notifications';
import { useSelector } from 'react-redux';


// Dummy ID (replace this with real user ID from auth)

const NotificationsScreen = () => {
    const navigation = useNavigation();
    const { theme, isDarkMode } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);

    const USER_ID = useSelector(state => state.auth.userObject?._id);

    const {
        data: notifications,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['notifications', USER_ID],
        queryFn: () => getUserNotifications(USER_ID),
    });

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card]}
            activeOpacity={0.8}
        >
            <LinearGradient
                start={{ x: 0.0, y: 0.95 }}
                end={{ x: 1.0, y: 1.0 }}
                colors={['rgba(0, 0, 0, 0.04)', 'rgba(255, 255, 255, 0)']}
                style={{ padding: 16 }}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.time}>{moment(item.sendAt).fromNow()}</Text>
                </View>
                <Text style={styles.message}>{item.message}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <ImageBackground source={theme.bg} style={styles.container}>
            <Header title="Notifications" style={{ marginTop: 20 }} />

            {isLoading ? (
                <ActivityIndicator size="large" color="#999" style={{ marginTop: 40 }} />
            ) : isError ? (
                <Text style={styles.emptyText}>Failed to load notifications</Text>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No notifications</Text>
                    }
                    refreshing={isLoading}
                    onRefresh={refetch}
                />
            )}
        </ImageBackground>
    );
};


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
    export default NotificationsScreen;