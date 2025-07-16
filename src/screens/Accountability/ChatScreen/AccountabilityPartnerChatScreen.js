import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform,
    ImageBackground,
    Animated
} from 'react-native';
import {
    bg,
    chatbot,
    send2,
    back,
    circle
} from '../../../assets/images';
import { getChatbotSessionId, sendChatbotMessage, getChatbotHistory } from '../../../functions/chatbotApi';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../../../context/ThemeProvider';

const AccountabilityPartnerChatScreen = ({ navigation, route }) => {
    const { partnerName } = route.params || { partnerName: 'AI Companion' };
    const { theme, isDarkMode } = useContext(ThemeContext);
    const userId = useSelector((state) => state.auth.userId);
    const dispatch = useDispatch();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const scrollViewRef = useRef();

    const dot1Anim = useRef(new Animated.Value(0)).current;
    const dot2Anim = useRef(new Animated.Value(0)).current;
    const dot3Anim = useRef(new Animated.Value(0)).current;

    const getTime = () =>
        new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

    const startDotAnimation = useCallback(() => {
        const createAnimation = (dotAnim, delay) =>
            Animated.loop(
                Animated.sequence([
                    Animated.timing(dotAnim, {
                        toValue: 1,
                        duration: 300,
                        delay,
                        useNativeDriver: true
                    }),
                    Animated.timing(dotAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true
                    })
                ])
            );

        const anim1 = createAnimation(dot1Anim, 0);
        const anim2 = createAnimation(dot2Anim, 300);
        const anim3 = createAnimation(dot3Anim, 600);

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
                dispatch(startLoading());
                const newSessionId = await getChatbotSessionId();
                setSessionId(newSessionId);

                if (userId) {
                    const oldMessages = await getChatbotHistory(userId);
                    const formattedHistory = oldMessages.map((msg, index) => ({
                        id: `history-${index}`,
                        text: msg.text,
                        sender: msg.sender === 'bot' ? 'partner' : 'me',
                        time: new Date(msg.timestamp).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        })
                    }));

                    setMessages(
                        formattedHistory.length > 0
                            ? formattedHistory
                            : [
                                {
                                    id: 'bot-greeting',
                                    text: 'Hello, how can I assist you today?',
                                    sender: 'partner',
                                    time: getTime()
                                }
                            ]
                    );
                }
            } catch (error) {
                setMessages([{
                    id: 'error-init',
                    text: 'Failed to start chat. Please try again later.',
                    sender: 'partner',
                    time: getTime()
                }]);
            } finally {
                dispatch(stopLoading());
            }
        };

        initializeChat();
    }, [userId]);

    const handleSendMessageToBot = useCallback(
        async (messageText) => {
            if (!sessionId) return;

            setIsBotTyping(true);
            const stopTypingAnim = startDotAnimation();

            try {
                const botResponse = await sendChatbotMessage(sessionId, messageText, userId);
                const responseText = botResponse?.response || "I didn't get a clear response. Could you rephrase?";
                const responseTokens = botResponse?.tokens || responseText.split(" ");

                setMessages(prev => [
                    ...prev,
                    {
                        id: `bot-${Date.now()}`,
                        tokens: responseTokens,
                        sender: 'partner',
                        time: getTime()
                    }
                ]);
            } catch (error) {
                setMessages(prev => [
                    ...prev,
                    {
                        id: `bot-error-${Date.now()}`,
                        text: `Error: ${error.message || 'Something went wrong.'}`,
                        sender: 'partner',
                        time: getTime()
                    }
                ]);
            } finally {
                setIsBotTyping(false);
                stopTypingAnim();
            }
        },
        [sessionId, userId, startDotAnimation]
    );

    const handleUserSendMessage = () => {
        if (newMessage.trim() === '' || isBotTyping) return;

        const userMsg = {
            id: `user-${Date.now()}`,
            text: newMessage.trim(),
            sender: 'me',
            time: getTime()
        };

        setMessages((prev) => [...prev, userMsg]);
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
                translateY: animValue.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, -3, 0]
                })
            }
        ]
    });

    const styles = getStyles(theme, isDarkMode);

    return (
        <ImageBackground source={theme.bg || bg} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.header}>
                        <View style={styles.partnerHeaderInfo}>
                            <Image source={chatbot} style={styles.partnerAvatar} />
                            <Text style={styles.partnerName}>{partnerName}</Text>
                        </View>
                    </View>

                    <ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={styles.messagesContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {messages.map((msg) => (
                            <View
                                key={msg.id}
                                style={[
                                    styles.messageBubble,
                                    msg.sender === 'me' ? styles.myMessage : styles.partnerMessage
                                ]}
                            >
                                {msg.tokens ? (
                                    <TypewriterTokens
                                        tokens={msg.tokens}
                                        textStyle={[
                                            styles.messageText,
                                            msg.sender === 'me' ? styles.myMessageText : styles.partnerMessageText
                                        ]}
                                    />
                                ) : (
                                    <Text style={[
                                        styles.messageText,
                                        msg.sender === 'me' ? styles.myMessageText : styles.partnerMessageText
                                    ]}>
                                        {msg.text}
                                    </Text>
                                )}
                            </View>
                        ))}

                        {isBotTyping && (
                            <View style={styles.typingIndicatorContainer}>
                                <View style={styles.partnerMessage}>
                                    <View style={styles.typingDotsWrapper}>
                                        <Animated.Image style={[styles.typingDot, getDotStyle(dot1Anim)]} source={circle} />
                                        <Animated.Image style={[styles.typingDot, getDotStyle(dot2Anim)]} source={circle} />
                                        <Animated.Image style={[styles.typingDot, getDotStyle(dot3Anim)]} source={circle} />
                                    </View>
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Type your message"
                            placeholderTextColor={theme.subTextColor}
                            value={newMessage}
                            onChangeText={setNewMessage}
                            onSubmitEditing={handleUserSendMessage}
                            multiline={false}
                            editable={!isBotTyping}
                        />
                        <TouchableOpacity onPress={handleUserSendMessage} style={styles.sendButton} disabled={isBotTyping}>
                            <Image source={send2} style={{ width: 25, height: 25, resizeMode: 'contain' }} />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
};
const TypewriterTokens = ({ tokens, textStyle }) => {
    const [visibleText, setVisibleText] = useState('');

    useEffect(() => {
        const fullText = tokens.join(' ');
        let index = 0;

        const interval = setInterval(() => {
            if (index < fullText.length) {
                setVisibleText(prev => prev + fullText[index]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 25); // adjust speed here (lower = faster)

        return () => clearInterval(interval);
    }, [tokens]);

    return (
        <Text style={textStyle}>
            {visibleText}
        </Text>
    );
};


const getStyles = (theme, isDarkMode) => StyleSheet.create({
    container: { flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : 10 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.borderColor
    },
    partnerHeaderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: 10
    },
    partnerAvatar: {
        width: 45,
        height: 30,
        resizeMode: 'cover',
        marginRight: 10
    },
    partnerName: {
        fontSize: 13,
        fontFamily: 'Inter-Medium',
        color: theme.textColor,
        top: 3
    },
    messagesContainer: {
        flexGrow: 1,
        paddingTop: 30,
        paddingHorizontal: 25,
        paddingVertical: 10
    },
    messageBubble: {
        maxWidth: '80%',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 13
    },
    myMessage: {
        marginRight: 10,
        alignSelf: 'flex-end',
        backgroundColor: theme.primaryColor,
        borderBottomRightRadius: 5
    },
    partnerMessage: {
        alignSelf: 'flex-start',
        backgroundColor: isDarkMode ? "#FFFFFF" : theme.borderColor,
        borderBottomLeftRadius: 5
    },
    messageText: { fontSize: 13 },
    myMessageText: { color: '#FFF' },
    partnerMessageText: { color: theme.textSecondaryColor },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Platform.OS === 'ios' ? "16%" : 95,
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9,
        borderColor: theme.borderColor,
        borderRadius: 8,
        marginHorizontal: 20
    },
    textInput: {
        flex: 1,
        paddingHorizontal: 15,
        color: theme.textColor,
        fontSize: 13,
        marginRight: 10,
        maxHeight: 100
    },
    sendButton: {
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },
    typingIndicatorContainer: {
        alignSelf: 'flex-start',
        marginBottom: 13
    },
    typingDotsWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 15,
        paddingVertical: 8,
        gap: 5
    },
    typingDot: {
        fontSize: 20,
        lineHeight: 18,
        color: 'gray',
        marginHorizontal: -2
    }
});

export default AccountabilityPartnerChatScreen;
