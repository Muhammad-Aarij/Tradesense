
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, ImageBackground, Animated } from 'react-native';
import { bg, chatbot, send2, back } from '../../../assets/images';
import theme from '../../../themes/theme';
import { getChatbotSessionId, sendChatbotMessage, getChatbotHistory } from '../../../functions/chatbotApi';
import { useSelector } from 'react-redux';

const AccountabilityPartnerChatScreen = ({ navigation, route }) => {
    const { partnerName } = route.params || { partnerName: 'AI Companion' };
    const userId = useSelector((state) => state.auth.userId);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const scrollViewRef = useRef();

    const dot1Anim = useRef(new Animated.Value(0)).current;
    const dot2Anim = useRef(new Animated.Value(0)).current;
    const dot3Anim = useRef(new Animated.Value(0)).current;

    const getTime = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const startDotAnimation = useCallback(() => {
        const createAnimation = (dotAnim, delay) => Animated.loop(
            Animated.sequence([
                Animated.timing(dotAnim, { toValue: 1, duration: 300, delay, useNativeDriver: true }),
                Animated.timing(dotAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
            ])
        );

        const anim1 = createAnimation(dot1Anim, 0);
        const anim2 = createAnimation(dot2Anim, 100);
        const anim3 = createAnimation(dot3Anim, 200);

        anim1.start();
        anim2.start();
        anim3.start();

        return () => {
            anim1.stop();
            anim2.stop();
            anim3.stop();
        };
    }, [dot1Anim, dot2Anim, dot3Anim]);

    useEffect(() => {
        const initializeChat = async () => {
            try {
                const newSessionId = await getChatbotSessionId();
                if (!newSessionId) {
                    setMessages([{ id: 'error-init', text: 'Failed to start chat. Please try again later.', sender: 'partner', time: getTime() }]);
                    return;
                }
                setSessionId(newSessionId);

                if (userId) {
                    // --- CORRECTION START ---
                    const oldMessages = await getChatbotHistory(userId);
                    // Map the 'timestamp' from the API to 'time' and 'bot' sender to 'partner'
                    const formattedHistory = oldMessages.map((msg, index) => ({
                        id: `history-${index}`,
                        text: msg.text,
                        sender: msg.sender === 'bot' ? 'partner' : 'me', // Map 'bot' to 'partner'
                        time: new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                    }));

                    setMessages([
                        ...formattedHistory,
                        { id: 'bot-greeting', text: 'Hello, how can I assist you today?', sender: 'partner', time: getTime() }
                    ]);
                    // --- CORRECTION END ---
                }

            } catch (error) {
                console.error('Chat initialization error:', error);
                setMessages([{ id: 'error-init-catch', text: 'Error connecting to chat service. Please try again.', sender: 'partner', time: getTime() }]);
            }
        };

        initializeChat();
    }, [userId]); // Add userId to the dependency array

    const handleSendMessageToBot = useCallback(async (messageText) => {
        if (!sessionId) {
            setMessages(prev => [...prev, { id: `warn-${Date.now()}`, text: 'Chat not ready. Please wait or restart.', sender: 'partner', time: getTime() }]);
            return;
        }

        setIsBotTyping(true);
        const stopLoadingAnim = startDotAnimation();

        try {
            const botResponse = await sendChatbotMessage(sessionId, messageText, userId);
            const responseText = botResponse || "I didn't get a clear response. Could you rephrase?";
            setMessages(prev => [...prev, { id: `bot-${Date.now()}`, text: responseText, sender: 'partner', time: getTime() }]);
        } catch (error) {
            console.error('Bot error:', error);
            setMessages(prev => [...prev, { id: `bot-error-${Date.now()}`, text: `Error: ${error.message || 'Something went wrong.'}`, sender: 'partner', time: getTime() }]);
        } finally {
            setIsBotTyping(false);
            stopLoadingAnim();
        }
    }, [sessionId, userId, startDotAnimation]);

    const handleUserSendMessage = () => {
        if (newMessage.trim() === '' || isBotTyping) return;

        const userMsg = {
            id: `user-${Date.now()}`,
            text: newMessage.trim(),
            sender: 'me',
            time: getTime(),
        };

        setMessages(prev => [...prev, userMsg]);
        const messageToSend = newMessage.trim();
        setNewMessage('');
        handleSendMessageToBot(messageToSend);
    };

    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages, isBotTyping]);

    const getDotStyle = (animValue) => ({
        transform: [
            {
                translateY: animValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -3, 0] })
            }
        ]
    });

    return (
        <ImageBackground source={bg} style={{ flex: 1 }}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.blurWrapper} onPress={() => navigation.goBack()}>
                        <View style={styles.blurView}>
                            <Image source={back} style={styles.backIcon} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.partnerHeaderInfo}>
                        <Image source={chatbot} style={styles.partnerAvatar} />
                        <Text style={styles.partnerName}>{partnerName}</Text>
                    </View>
                </View>

                <ScrollView ref={scrollViewRef} contentContainerStyle={styles.messagesContainer} showsVerticalScrollIndicator={false}>
                    {messages.map((msg) => (
                        <View key={msg.id} style={[styles.messageBubble, msg.sender === 'me' ? styles.myMessage : styles.partnerMessage]}>
                            <Text style={[styles.messageText, msg.sender === 'me' ? styles.myMessageText : styles.partnerMessageText]}>
                                {msg.text}
                            </Text>
                        </View>
                    ))}
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

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type your message"
                        placeholderTextColor="#A0A0A0"
                        value={newMessage}
                        onChangeText={setNewMessage}
                        onSubmitEditing={handleUserSendMessage}
                        multiline={false}
                        editable={!isBotTyping}
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
    container: { flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : 20 },
    blurWrapper: { width: 35, height: 35, borderRadius: 20, padding: 12, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: "rgba(0, 0, 0, 0.35)" },
    blurView: { width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center' },
    backIcon: { width: 15, height: 15, resizeMode: 'contain', tintColor: 'white' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#2A2A2A' },
    partnerHeaderInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 10 },
    partnerAvatar: { width: 30, height: 30, resizeMode: 'contain', marginRight: 10 },
    partnerName: { fontSize: 13, fontFamily: "Inter-Medium", color: '#E0E0E0' },
    messagesContainer: { flexGrow: 1, paddingTop: 30, paddingHorizontal: 20, paddingVertical: 10 },
    messageBubble: { maxWidth: '80%', borderRadius: 18, paddingHorizontal: 15, paddingVertical: 8, marginBottom: 13 },
    myMessage: { marginRight: 10, alignSelf: 'flex-end', backgroundColor: theme.primaryColor, borderBottomRightRadius: 5 },
    partnerMessage: { alignSelf: 'flex-start', backgroundColor: 'white', borderBottomLeftRadius: 5 },
    messageText: { fontSize: 13 },
    myMessageText: { color: "white" },
    partnerMessageText: { color: "gray" },
    inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: Platform.OS === 'ios' ? 30 : 95, paddingHorizontal: 15, paddingVertical: 5, backgroundColor: 'rgba(255, 255, 255, 0.06)', borderWidth: 0.9, borderColor: theme.borderColor, borderRadius: 8, marginHorizontal: 20 },
    textInput: { flex: 1, paddingHorizontal: 15, color: '#E0E0E0', fontSize: 13, marginRight: 10, maxHeight: 100 },
    sendButton: { borderRadius: 20, justifyContent: 'center', alignItems: 'center', padding: 5 },
    typingIndicatorContainer: { alignSelf: 'flex-start', marginBottom: 13 },
    typingDotsWrapper: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 15, paddingVertical: 8 },
    typingDot: { fontSize: 20, lineHeight: 18, color: 'gray', marginHorizontal: -2 },
});

export default AccountabilityPartnerChatScreen;