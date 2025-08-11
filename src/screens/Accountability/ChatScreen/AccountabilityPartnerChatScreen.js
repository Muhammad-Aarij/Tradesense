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
    Keyboard,
    Dimensions,
    Alert
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
    bg,
    chatbot,
    send2,
    back,
    locked,
    subscription,
    attention
} from '../../../assets/images';
import { getChatbotSessionId, sendChatbotMessage, getChatbotHistory } from '../../../functions/chatbotApi';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../../../context/ThemeProvider';
import typing from '../../../assets/typing.json';
import ConfirmationModal from '../../../components/ConfirmationModal';
import AnimatedInfoBox from '../../../components/AnimatedInfoBox';

const { height, width } = Dimensions.get('window');

const LOADING_ANIMATION = typing;

const AccountabilityPartnerChatScreen = ({ navigation, route }) => {
    const { partnerName } = route.params || { partnerName: 'AI Companion' };
    const { theme, isDarkMode } = useContext(ThemeContext);
    const dispatch = useDispatch();

    const userId = useSelector((state) => state.auth.userId);
    const userObject = useSelector((state) => state.auth.userObject);
    const isPremiumUser = userObject?.isPremium || false;

    console.log("UserObject.isPremium:", isPremiumUser);

    const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);
    const [isTypingDone, setIsTypingDone] = useState(true);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    const scrollViewRef = useRef();

    const getTime = () =>
        new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

    useEffect(() => {
        const initializeChatSessionAndHistory = async () => {
            if (!userId) {
                console.warn("User ID not available for chat initialization.");
                return;
            }

            if (!isPremiumUser) {
                setMessages([{
                    id: 'premium-prompt-initial',
                    text: 'Please subscribe to unlock full chat features.',
                    sender: 'partner',
                    time: getTime()
                }]);
                return;
            }

            try {
                dispatch(startLoading());
                const newSessionId = await getChatbotSessionId();
                setSessionId(newSessionId);

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
            } catch (error) {
                console.error("Chat initialization error:", error);
                Alert.alert("Chat Error", "Failed to start chat. Please try again later.");
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

        initializeChatSessionAndHistory();

        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [userId, dispatch, isPremiumUser]);

    useFocusEffect(
        useCallback(() => {
            if (!isPremiumUser) {
                setShowPremiumModal(true);
            }
            return () => {
            };
        }, [isPremiumUser])
    );

    // This memoized function's reference will not change across renders
    const handleTypingDone = useCallback(() => {
        setIsTypingDone(true);
    }, []);

    const handleSendMessageToBot = useCallback(
        async (messageText) => {
            if (!sessionId || !isPremiumUser) {
                Alert.alert("Premium Feature", "Please subscribe to send messages.");
                return;
            }

            setIsLoadingResponse(true);
            setIsTypingDone(false);

            try {
                const botResponse = await sendChatbotMessage(sessionId, messageText, userId);
                const responseText = botResponse?.response || "I didn't get a clear response. Could you rephrase?";
                const responseTokens = responseText.split(" ");

                setIsLoadingResponse(false);

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
                console.error("Error sending message to bot:", error);
                Alert.alert("Message Error", `Failed to send message: ${error.message || 'Something went wrong.'}`);
                setMessages(prev => [
                    ...prev,
                    {
                        id: `bot-error-${Date.now()}`,
                        text: `Error: ${error.message || 'Something went wrong.'}`,
                        sender: 'partner',
                        time: getTime()
                    }
                ]);
                setIsLoadingResponse(false);
                setIsTypingDone(true);
            }
        },
        [sessionId, userId, isPremiumUser]
    );

    const handleUserSendMessage = () => {
        if (newMessage.trim() === '' || isLoadingResponse || !isPremiumUser || !isTypingDone) {
            if (!isPremiumUser) {
                Alert.alert("Premium Feature", "Please subscribe to send messages.");
            }
            return;
        }

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
        const timer = setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
        return () => clearTimeout(timer);
    }, [messages, isLoadingResponse]);

    const styles = getStyles(theme, isDarkMode, keyboardHeight);

    return (
        <ImageBackground source={bg} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.header}>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center ", width: "auto", }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <Image source={back} style={styles.backIcon} />
                            </TouchableOpacity>
                            <View style={styles.partnerHeaderInfo}>
                                <Image source={chatbot} style={styles.partnerAvatar} />
                                <Text style={styles.partnerName}>{partnerName}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.controlButton1} onPress={() => setIsDisclaimerVisible(true)}>
                            <Image source={attention} style={{ ...styles.controlIcon }} />
                        </TouchableOpacity>
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
                                        onTypingDone={handleTypingDone} // Pass the memoized function here
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

                        {isLoadingResponse && (
                            <View style={[styles.messageBubble, styles.partnerMessage, styles.typingIndicatorContainer]}>
                                <LottieView
                                    source={LOADING_ANIMATION}
                                    autoPlay
                                    loop
                                    style={styles.typingLottieAnimation}
                                />
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
                            editable={!isLoadingResponse && isPremiumUser && isTypingDone}
                        />
                        <TouchableOpacity
                            onPress={handleUserSendMessage}
                            style={styles.sendButton}
                            disabled={isLoadingResponse || !isPremiumUser || newMessage.trim() === '' || !isTypingDone}
                        >
                            <Image
                                source={send2}
                                style={{
                                    width: 25,
                                    height: 25,
                                    resizeMode: 'contain',
                                    tintColor: (isLoadingResponse || !isPremiumUser || newMessage.trim() === '' || !isTypingDone) ? 'gray' : theme.primaryColor
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>

            {showPremiumModal && (
                <ConfirmationModal
                    isVisible={showPremiumModal}
                    title={"Unlock Premium Content"}
                    message={"Subscribe to access all guided sessions, expert talks, and exclusive audio and video experiences."}
                    icon={subscription}
                    buttonText="Subscribe Now"
                    onCrossClose={() => {
                        setShowPremiumModal(false);
                    }}
                    onClose={() => {
                        setShowPremiumModal(false);
                        navigation.navigate("More", {
                            screen: "AppSubscription",
                        });
                    }}
                />
            )}

            <AnimatedInfoBox
                isVisible={isDisclaimerVisible}
                onClose={() => setIsDisclaimerVisible(false)}
                title="Disclaimer"
                message={
                    "This chatbot provides responses for educational, informational, and entertainment purposes only. It is not a substitute for professional advice—be it medical, legal, financial, or otherwise. Always seek the guidance of qualified professionals before making decisions based on content from this chat."
                }
                position="center"
                maxWidth={width * 0.85}
            />
        </ImageBackground>
    );
};

// ... TypewriterTokens and getStyles remain unchanged
const TypewriterTokens = ({ tokens, textStyle, onTypingDone }) => {
    const [displayedText, setDisplayedText] = useState('');
    const intervalRef = useRef(null);
    const fullTextRef = useRef('');
    const charIndexRef = useRef(0);

    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        fullTextRef.current = tokens.join(' ');
        charIndexRef.current = 0;
        setDisplayedText('');

        if (!fullTextRef.current) {
            onTypingDone();
            return;
        }

        intervalRef.current = setInterval(() => {
            if (charIndexRef.current < fullTextRef.current.length) {
                setDisplayedText(prev => prev + fullTextRef.current[charIndexRef.current]);
                charIndexRef.current++;
            } else {
                clearInterval(intervalRef.current);
                onTypingDone();
            }
        }, 25);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [tokens, onTypingDone]);

    return (
        <Text style={textStyle}>
            {displayedText}
        </Text>
    );
};

const getStyles = (theme, isDarkMode, keyboardHeight) => StyleSheet.create({
    container: { flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : 10 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.borderColor,
    },
    backButton: {
        padding: 5,
        justifyContent: "flex-end",
    },
    backIcon: {
        width: 10,
        height: 10,
        resizeMode: 'contain',
        tintColor: theme.textColor,
    },
    controlButton1: {
        padding: 10,
    },
    controlIcon: {
        width: 20,
        height: 20,
        tintColor: '#FFFFFF',
        resizeMode: 'contain',
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
        fontFamily: 'Outfit-Medium',
        color: theme.textColor,
        top: 3
    },
    messagesContainer: {
        flexGrow: 1,
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    messageBubble: {
        maxWidth: '80%',
        marginBottom: 13,
    },
    myMessage: {
        fontFamily: 'Outfit-Medium',
        marginRight: 0,
        alignSelf: 'flex-end',
        backgroundColor: theme.primaryColor,
        borderRadius: 15,
        borderBottomRightRadius: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    partnerMessage: {
        fontFamily: 'Outfit-Medium',
        alignSelf: 'flex-start',
        backgroundColor: isDarkMode ? "#FFFFFF" : theme.borderColor,
        borderRadius: 15,
        borderBottomLeftRadius: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    messageText: { fontSize: 13 },
    myMessageText: { color: '#FFF' },
    partnerMessageText: {
        color: !isDarkMode ? theme.subTextColor : 'black',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Platform.OS === 'ios' ? keyboardHeight : (keyboardHeight > 0 ? 130 : 95),
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
    },
    typingLottieAnimation: {
        width: 50,
        height: 30,
    },
    lottieContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    lottieAnimation: {
        width: 100,
        height: 50,
    },
    loadingText: {
        color: theme.subTextColor,
        marginTop: 10,
        fontSize: 16,
    },
});

export default AccountabilityPartnerChatScreen;