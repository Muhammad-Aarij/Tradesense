// src/screens/Accountability/ChatScreen/AccountabilityPartnerChatScreen.js

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, ImageBackground, Animated } from 'react-native';
// import { BlurView } from '@react-native-community/blur'; // Keep commented out if not installed
import { bg, chatbot, send2, back } from '../../../assets/images'; // Assuming these paths are correct
import theme from '../../../themes/theme';
import { getChatbotSessionId, sendChatbotMessage } from '../../../functions/chatbotApi';

const AccountabilityPartnerChatScreen = ({ navigation, route }) => {
    const { partnerName } = route.params || { partnerName: 'AI Companion' };

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const scrollViewRef = useRef();

    // Animated values for loading dots (for the "..." effect)
    const dot1Anim = useRef(new Animated.Value(0)).current;
    const dot2Anim = useRef(new Animated.Value(0)).current;
    const dot3Anim = useRef(new Animated.Value(0)).current;

    // --- Animation for loading dots ---
    const startDotAnimation = useCallback(() => {
        const createAnimation = (dotAnim, delay) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.timing(dotAnim, {
                        toValue: 1,
                        duration: 300,
                        delay,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dotAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        const anim1 = createAnimation(dot1Anim, 0);
        const anim2 = createAnimation(dot2Anim, 100);
        const anim3 = createAnimation(dot3Anim, 200);

        anim1.start();
        anim2.start();
        anim3.start();

        return () => { // Cleanup function to stop animations
            anim1.stop();
            anim2.stop();
            anim3.stop();
        };
    }, [dot1Anim, dot2Anim, dot3Anim]);


    // --- API Calls Integration ---

    // 1. Get Session ID on component mount
    useEffect(() => {
        const initializeChat = async () => {
            try {
                const newSessionId = await getChatbotSessionId();
                if (newSessionId) {
                    setSessionId(newSessionId);
                    setMessages([{ id: 'bot-greeting', text: `Hello, how can I assist you today?`, sender: 'partner', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) }]);
                } else {
                    // Handle case where session ID could not be retrieved
                    setMessages([{ id: 'error-init', text: 'Failed to start chat. Please try again later.', sender: 'partner', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) }]);
                }
            } catch (error) {
                console.error('Chat initialization error:', error);
                setMessages([{ id: 'error-init-catch', text: 'Error connecting to chat service. Please try again.', sender: 'partner', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) }]);
            }
        };

        initializeChat();
    }, []);


    // 2. Send message to bot and get response
    const handleSendMessageToBot = useCallback(async (messageText) => {
        if (!sessionId) {
            console.warn('Session ID not available. Cannot send message.');
            setMessages(prevMessages => [...prevMessages, { id: `warn-${Date.now()}`, text: 'Chat not ready. Please wait or restart.', sender: 'partner', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) }]);
            return;
        }

        setIsBotTyping(true); // Show loading indicator
        const stopLoadingAnimation = startDotAnimation(); // Start loading animation

        try {
            const botResponse = await sendChatbotMessage(sessionId, messageText);
            if (botResponse) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        id: `bot-${Date.now()}`,
                        text: botResponse,
                        sender: 'partner',
                        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                    },
                ]);
            } else {
                console.warn('Bot response was empty or null.');
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        id: `bot-empty-response-${Date.now()}`,
                        text: "I didn't get a clear response. Could you rephrase?",
                        sender: 'partner',
                        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                    },
                ]);
            }
        } catch (error) {
            console.error('Error in sendChatbotMessage:', error);
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    id: `bot-api-error-${Date.now()}`,
                    text: `Error contacting chat service: ${error.message || 'Unknown error'}.`,
                    sender: 'partner',
                    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                },
            ]);
        } finally {
            setIsBotTyping(false); // Hide loading indicator
            stopLoadingAnimation(); // Stop loading animation
        }
    }, [sessionId, startDotAnimation]);


    // --- Message handling and UI updates ---

    const handleUserSendMessage = () => {
        if (newMessage.trim() === '' || isBotTyping) {
            return; // Prevent sending empty messages or while bot is typing
        }

        const userMsg = {
            id: `user-${Date.now()}`,
            text: newMessage.trim(),
            sender: 'me',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        };
        setMessages(prevMessages => [...prevMessages, userMsg]);
        const messageToSend = newMessage.trim();
        setNewMessage(''); // Clear input immediately
        handleSendMessageToBot(messageToSend); // Send to bot API
    };

    // Scroll to bottom when messages update or bot starts/stops typing
    useEffect(() => {
        // Use a slight delay to ensure layout has updated before scrolling
        setTimeout(() => {
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true });
            }
        }, 100);
    }, [messages, isBotTyping]);


    const getDotStyle = (animValue) => {
        return {
            marginBottom: animValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 3, 0], // Bounces up by 3 units
            }),
        };
    };

    return (
        <ImageBackground source={bg} style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.blurWrapper} onPress={() => navigation.goBack()}>
                        {/* <BlurView blurType="dark" blurAmount={20} style={styles.blurView}> */}
                        <View style={styles.blurView}>
                            <Image source={back} style={styles.backIcon} />
                        </View>
                        {/* </BlurView> */}
                    </TouchableOpacity>
                    <View style={styles.partnerHeaderInfo}>
                        <Image source={chatbot} style={styles.partnerAvatar} />
                        <View>
                            <Text style={styles.partnerName}>{partnerName}</Text>
                        </View>
                    </View>
                    {/* Optional: Add a 3-dot options button here if needed */}
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
                            <Text style={[
                                styles.messageText,
                                message.sender === 'me' ? styles.myMessageText : styles.partnerMessageText,
                            ]}>{message.text}</Text>
                            {/* You can uncomment this if you want to show time within the bubble */}
                            {/* <Text style={[
                                styles.messageTimeSmall,
                                message.sender === 'me' ? { color: 'rgba(255,255,255,0.7)' } : { color: 'rgba(0,0,0,0.5)' },
                            ]}>{message.time}</Text> */}
                        </View>
                    ))}

                    {/* Loading Indicator for Bot Typing */}
                    {isBotTyping && (
                        <View style={styles.typingIndicatorContainer}>
                            <View style={styles.partnerMessage}>
                                <View style={styles.typingDotsWrapper}>
                                    <Animated.Text style={[styles.typingDot, getDotStyle(dot1Anim)]}>.</Animated.Text>
                                    <Animated.Text style={[styles.typingDot, getDotStyle(dot2Anim)]}>.</Animated.Text>
                                    <Animated.Text style={[styles.typingDot, getDotStyle(dot3Anim)]}>.</Animated.Text>
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Message Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type your message"
                        placeholderTextColor="#A0A0A0"
                        value={newMessage}
                        onChangeText={setNewMessage}
                        onSubmitEditing={handleUserSendMessage}
                        multiline={false}
                        editable={!isBotTyping} // Disable input while bot is typing
                    />
                    <TouchableOpacity onPress={handleUserSendMessage} style={styles.sendButton} disabled={isBotTyping}>
                        <Image source={send2} style={{ width: 25, height: 25, resizeMode: "contain" }} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 0 : 20,
    },
    blurWrapper: {
        width: 35, height: 35, borderRadius: 20, padding: 12, overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.35)"
    },
    blurView: {
        width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center',
    },
    backIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        tintColor: 'white', // Assuming back icon is white
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    partnerHeaderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: 10,
    },
    partnerAvatar: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 10,
    },
    partnerName: {
        fontSize: 13,
        fontFamily: "Inter-Medium", // Ensure font is loaded
        color: '#E0E0E0',
    },
    messagesContainer: {
        flexGrow: 1,
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    messageBubble: {
        maxWidth: '80%',
        borderRadius: 18,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginBottom: 13,
    },
    myMessage: {
        marginRight: 10,
        alignSelf: 'flex-end',
        backgroundColor: theme.primaryColor, // Use theme.primaryColor
        borderBottomRightRadius: 5,
        // Optional: remove bottom-right if you want full rounded bubble
    },
    partnerMessage: {
        alignSelf: 'flex-start',
        backgroundColor: 'white', // Bot's messages are white as per image
        borderBottomLeftRadius: 5,
        // Optional: remove bottom-left if you want full rounded bubble
    },
    messageText: {
        fontSize: 13,
    },
    myMessageText: {
        color: "white",
    },
    partnerMessageText: {
        color: "gray",
    },
    messageTimeSmall: {
        fontSize: 10,
        alignSelf: 'flex-end',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Platform.OS === 'ios' ? 30 : 95, // Adjust for iOS keyboard vs Android fixed padding
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9,
        borderColor: theme.borderColor, // Use theme.borderColor
        borderRadius: 8,
        marginHorizontal: 20,
    },
    textInput: {
        flex: 1,
        paddingHorizontal: 15,
        color: '#E0E0E0',
        fontSize: 13,
        marginRight: 10,
        maxHeight: 100,
    },
    sendButton: {
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5, // Added padding to make touchable area bigger
    },
    // Styles for typing indicator
    typingIndicatorContainer: {
        alignSelf: 'flex-start', // Align to left, like partner messages
        marginBottom: 13,
    },
    typingDotsWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end', // Align dots at the bottom
        paddingHorizontal: 15,
        paddingVertical: 8,
        // Inherits background and border radius from partnerMessage style
    },
    typingDot: {
        fontSize: 20, // Larger dot size
        lineHeight: 18, // Adjust line height to prevent dots from being too spaced vertically
        color: 'gray', // Color matching partner's text
        marginHorizontal: -2, // Reduce space between dots
    },
});

export default AccountabilityPartnerChatScreen;
