
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { back, bg, shape, user } from '../../../assets/images';
// import { BlurView } from '@react-native-community/blur';
import theme from '../../../themes/theme';

const AccountabilityPartnerChatScreen = ({ navigation, route }) => {
    // Get partner details from route params
    const { partnerId, partnerName, partnerAvatar, isOnline } = route.params || {
        partnerId: 'default',
        partnerName: 'Dianne', // Default to Dianne as shown in the image
        partnerAvatar: 'https://placehold.co/40x40/90EE90/000?text=D',
        isOnline: true,
    };

    // Mock chat messages
    const [messages, setMessages] = useState([
        { id: 'm1', text: "Hey! what's the update ?", sender: 'partner', time: '10:00 AM' },
        { id: 'm2', text: "Yeah, will be up in a minute.", sender: 'me', time: '10:05 AM' },
        { id: 'm3', text: "I'm nervous", sender: 'me', time: '10:06 AM' },
        { id: 'm4', text: "Trust you girl you will be fine", sender: 'partner', time: '10:10 AM' },
        { id: 'm5', text: "Thank you", sender: 'me', time: '10:11 AM' },
        { id: 'm6', text: "Nice performance today dear!", sender: 'partner', time: '10:30 AM' },
    ]);

    const [newMessage, setNewMessage] = useState('');
    const scrollViewRef = useRef();

    // Scroll to bottom on new message
    useEffect(() => {
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg = {
                id: `m${messages.length + 1}`,
                text: newMessage.trim(),
                sender: 'me',
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

    return (
        <ImageBackground source={bg} style={{ flex: 1, }}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust as needed
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.blurWrapper} >
                        {/* <BlurView blurType="dark" blurAmount={20} style={styles.blurView}> */}
                        <View style={styles.blurView}>
                            <Image source={back} style={{ width: 15, height: 15, resizeMode: 'contain', padding: 10 }} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.partnerHeaderInfo}>
                        <Image source={user} style={styles.partnerAvatar} />
                        <View>
                            <Text style={styles.partnerName}>{partnerName}</Text>
                            <Text style={styles.partnerStatus}>{isOnline ? 'Online' : 'Offline'}</Text>
                        </View>
                    </View>
                </View>

                {/* Chat Messages */}
                <ScrollView ref={scrollViewRef} contentContainerStyle={styles.messagesContainer} showsVerticalScrollIndicator={false}>
                    {messages.map((message) => (
                        <View
                            key={message.id}
                            style={[
                                styles.messageBubble,
                                message.sender === 'me' ? styles.myMessage : styles.partnerMessage,
                            ]}
                        >
                            {/* <Image source={shape}  style={{width:202,height:220,resizeMode:"contain", position:"absolute",bottom:0,right: -15,}}/> */}
                            <Text style={[
                                styles.messageText,
                                message.sender === 'me' ? styles.myMessageText : styles.partnerMessageText,
                            ]} >{message.text}</Text>
                            <Text style={[
                                styles.messageText,
                                message.sender === 'me' ? styles.myMessageText : styles.partnerMessageText,
                            ]}>{message.time}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Message Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type your message"
                        placeholderTextColor="#A0A0A0"
                        value={newMessage}
                        onChangeText={setNewMessage}
                        onSubmitEditing={handleSendMessage} // Allows sending on keyboard return
                        multiline={false} // Prevents multiline input expanding vertically
                    />
                    <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                        <Text style={styles.sendIcon}>⬆️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('Attach file pressed')} style={styles.attachButton}>
                        <Text style={styles.attachIcon}>📎</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 0 : 20, // Adjust for Android status bar
    },

    blurWrapper: {
        width: 35, height: 35, borderRadius: 20, padding: 12, overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.35)"
    },

    blurView: {
        width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center',
    },

    backIcon: { width: 17, height: 17, resizeMode: 'contain' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A', // Separator line
    },
    backButton: {
        paddingRight: 15,
    },
    backIcon: {
        fontSize: 24,
        color: '#E0E0E0',
        fontWeight: 'bold',
    },
    partnerHeaderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: 10,
        // justifyContent: 'center', // Center partner info
    },
    partnerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#555',
    },
    partnerName: {
        fontSize: 13,
        fontFamily: "Inter-Medium",
        color: '#E0E0E0',
    },
    partnerStatus: {
        fontSize: 11,
        fontFamily: "Inter-Medium",
        color: '#4CAF50',
    },
    optionsButton: {
        paddingLeft: 15,
    },
    optionsIcon: {
        fontSize: 24,
        color: '#E0E0E0',
    },
    messagesContainer: {
        flexGrow: 1,
        position:"relative",
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    messageBubble: {
        maxWidth: '80%', // Limit bubble width
        borderRadius: 18,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginBottom: 13,
    },
    myMessage: {
        marginRight: 10,
        alignSelf: 'flex-end',
        backgroundColor: theme.primaryColor, // Blue for sender's messages
        borderBottomRightRadius: 5, // Pointed corner for sender
    },
    partnerMessage: {
        alignSelf: 'flex-start',
        backgroundColor: 'white', // Dark grey for partner's messages
        borderBottomLeftRadius: 5, // Pointed corner for partner
    },
    myMessageText: {
        color:"white",
    },
    partnerMessageText: {
      color:"gray",
    },
    messageText: {
        fontSize: 13,
        color: '#FFFFFF',
    },
    messageTimeSmall: {
        fontSize: 10,
        color: 'white',
        alignSelf: 'flex-end',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2A2A', // Input bar background
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#3A3A3A',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#1E1E1E', // Text input field background
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        color: '#E0E0E0',
        fontSize: 16,
        marginRight: 10,
        maxHeight: 100, // Prevent it from growing too tall
    },
    sendButton: {
        backgroundColor: '#007AFF', // Blue send button
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendIcon: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    attachButton: {
        marginLeft: 10,
        padding: 5,
    },
    attachIcon: {
        fontSize: 20,
        color: '#A0A0A0', // Grey attachment icon
    },
});

export default AccountabilityPartnerChatScreen;

