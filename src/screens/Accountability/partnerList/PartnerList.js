
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Platform, ImageBackground } from 'react-native';
import { bell, bg, searchMf, user } from '../../../assets/images';
import theme from '../../../themes/theme';

const AccountabilityPartnerListScreen = ({ navigation }) => {
    // Mock data for accountability partners
    const partners = [
        {
            id: 'p1',
            name: 'Jane',
            status: 'Connected',
            lastMessage: 'Hello are you met fwqh hfwqio iuhfqw iufq wui fqiu ',
            time: '5min',
            avatar: user, // Pink placeholder for Jane
            isOnline: true, // For online/offline indicator (though not visible in this screen of the image)
        },
        {
            id: 'p2',
            name: 'Leslie',
            status: 'Connected',
            lastMessage: 'Yea',
            time: '3:00 PM',
            avatar: user, // Light blue placeholder for Leslie
            isOnline: false,
        },
    ];

    return (
        <ImageBackground source={bg} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Accountability Partner</Text>
                <TouchableOpacity onPress={() => console.log('Notification icon pressed')} style={styles.notificationButton}>
                    <Image style={styles.notificationIcon} source={bell} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBar}>
                <Image source={searchMf} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#A0A0A0"
                />
            </View>

            {/* Connected Status */}
            <Text style={styles.connectedStatus}>Connected</Text>

            {/* Partners List */}
            <ScrollView contentContainerStyle={styles.partnersListContent} showsVerticalScrollIndicator={false}>
                {partners.map((partner) => (
                    <TouchableOpacity
                        key={partner.id}
                        style={styles.partnerItem}
                        onPress={() => navigation?.navigate('ChatScreen', { partnerId: partner.id, partnerName: partner.name, partnerAvatar: partner.avatar, isOnline: partner.isOnline })}
                    >
                        <View style={styles.partnerAvatarContainer}>
                            <Image source={partner.avatar} style={styles.partnerAvatar} />
                            {/* Online indicator - if isOnline is true and design allows */}
                            {partner.isOnline && <View style={styles.onlineIndicator} />}
                        </View>
                        <View style={styles.partnerInfo}>
                            <Text style={styles.partnerName}>{partner.name}</Text>
                            <Text style={styles.lastMessage} numberOfLines={1}>{partner.lastMessage}</Text>
                        </View>
                        <View style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
                            <Text style={styles.messageTime}>{partner.time}</Text>
                            <Text style={{ fontFamily: "Outfit-SemiBold", color: "white", backgroundColor: theme.primaryColor, borderRadius: 10, width: 20, height: 20, textAlign: "center", marginTop: 5 }}>5</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingHorizontal: 25,
        // backgroundColor: '#111317', // Overall dark background
        paddingTop: Platform.OS === 'ios' ? 0 : 20, // Adjust for Android status bar
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        paddingRight: 15,
    },
    backIcon: {
        fontSize: 24,
        color: '#E0E0E0',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E0E0E0',
        flex: 1,
        textAlign: 'center',
    },
    notificationButton: {
        paddingLeft: 15,
    },
    notificationIcon: {
        width: 44,
        height: 44,
        resizeMode: "contain",
        color: '#E0E0E0',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9, borderColor: theme.borderColor,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginHorizontal: 20,
        marginVertical: 20,
        height: 55,
    },
    searchIcon: {
        width: 25, height: 25, resizeMode: "contain",
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: '#E0E0E0',
        fontSize: 13,
    },
    connectedStatus: {
        fontSize: 14,
        color: '#FFFFFF',
        fontFamily: "Outfit-Light-BETA",
        marginLeft: 20,
        marginBottom: 10,
    },
    partnersListContent: {
        paddingHorizontal: 20,
        paddingBottom: 20, // Space at the bottom
    },
    partnerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        // backgroundColor: '#2A2A2A', // Card background
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
    },
    partnerAvatarContainer: {
        position: 'relative',
        marginRight: 15,
    },
    partnerAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#555', // Placeholder color
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50', // Green for online
        borderWidth: 2,
        borderColor: '#2A2A2A', // Matches card background
    },
    partnerInfo: {
        flex: 1,
    },
    partnerName: {
        fontSize: 13,
        fontFamily: "Outfit-Medium",
        color: '#FFFFFF',
        marginBottom: 1,
    },
    lastMessage: {
        fontSize: 11,
        color: '#B0B0B0',
        marginRight: 5,
    },
    messageTime: {
        fontSize: 10,
        color: '#ffffff',
        fontFamily: "Outfit-Regular",
        marginLeft: 10,
    },
});

export default AccountabilityPartnerListScreen;
