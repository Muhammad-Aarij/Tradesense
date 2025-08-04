import React, { useContext, useMemo, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // Removed useMutation

import { ThemeContext } from '../../context/ThemeProvider';
import Header from '../../components/Header';
import { getUserNotifications } from '../../functions/notifications';
import { useSelector, useDispatch } from 'react-redux';
import { stopLoading, startLoading } from '../../redux/slice/loaderSlice';


const NotificationsScreen = () => {
    const { theme, isDarkMode } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);
    const dispatch = useDispatch();
    const USER_ID = useSelector(state => state.auth.userObject?._id);
    const queryClient = useQueryClient();
    const {
        data: notifications,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['notifications', USER_ID],
        queryFn: () => getUserNotifications(USER_ID),
    });

    useEffect(() => {
        dispatch(startLoading());
        const timeout = setTimeout(() => {
            if (!isLoading) dispatch(stopLoading());
        }, 2000);
        return () => clearTimeout(timeout);
    }, [isLoading, dispatch]);


    // Mark as read mutation is commented out as you don't have the function yet.
    // When you implement markNotificationAsRead, uncomment this block.
    /*
    const markAsReadMutation = useMutation({
        mutationFn: markNotificationAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications', USER_ID]);
        },
    });
    */

    const [expandedIds, setExpandedIds] = useState([]);
    const [readIds, setReadIds] = useState([]);

    const renderItem = ({ item }) => {
        const showFullMessage = expandedIds.includes(item._id);
        const isRead = readIds.includes(item._id) || item.isRead;

        const toggleMessageVisibility = () => {
            setExpandedIds(prev =>
                prev.includes(item._id)
                    ? prev.filter(id => id !== item._id)
                    : [...prev, item._id]
            );
            if (!isRead) {
                setReadIds(prev => [...prev, item._id]);
                // Optionally: mark as read in backend here
            }
        };

        const truncatedMessage =
            item.message.length > 100 && !showFullMessage
                ? `${item.message.substring(0, 100)}...`
                : item.message;

        return (
            <TouchableOpacity
                style={[styles.card]}
                activeOpacity={0.8}
                onPress={toggleMessageVisibility}
            >
                <LinearGradient
                    start={{ x: 0.0, y: 0.95 }}
                    end={{ x: 1.0, y: 1.0 }}
                    colors={['rgba(0, 0, 0, 0.04)', 'rgba(255, 255, 255, 0)']}
                    style={{}}
                >
                    <View style={{ padding: 16 }}>
                        <View style={styles.cardHeader}>
                            <View style={styles.titleContainer}>
                                {!isRead && <View style={styles.unreadDot} />}
                                <Text style={styles.title}>{item.title}</Text>
                            </View>
                            <Text style={styles.time}>{moment(item.sendAt).fromNow()}</Text>
                        </View>
                        <Text
                            style={styles.message}
                            numberOfLines={!isRead && !showFullMessage ? 1 : undefined}
                            ellipsizeMode="tail"
                        >
                            {item.message}
                        </Text>
                        {/* 
                    {item.message.length > 100 && !isRead && (
                        <Text onPress={toggleMessageVisibility} style={styles.readMoreText}>
                            {showFullMessage ? 'Show Less' : 'Read More'}
                        </Text>
                    )} */}
                    </View>

                </LinearGradient>
            </TouchableOpacity>
        );
    };

    return (
        <ImageBackground source={theme.bg} style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <Header title="Notifications" style={{ marginTop: 20 }} />

                {isError ? (
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
            </SafeAreaView>
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
            paddingBottom: 20,
        },
        card: {
            padding: 5,
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
            alignItems: 'flex-start',
            marginBottom: 8,
        },
        titleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: "85%",
            // borderWidth:2,
        },
        unreadDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: 'green',
            marginRight: 8,
        },
        title: {
            textTransform: "capitalize",
            // maxWidth: "85%",
            fontSize: 12,
            fontFamily: "Outfit-Medium",
            color: theme.textColor,
        },
        message: {
            fontSize: 11,
            fontFamily: "Outfit-Regular",
            color: theme.subTextColor,
        },
        readMoreText: {
            fontSize: 10,
            color: theme.primaryColor,
            fontWeight: 'bold',
        },
        time: {
            fontSize: 9,
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