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
    Keyboard // Import Keyboard for keyboard events
} from 'react-native';
import LottieView from 'lottie-react-native';
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
import typing from '../../../assets/typing.json' // Assuming this is your typing Lottie animation

// Assuming your Lottie animation JSON files are located here
const LOADING_ANIMATION = typing; // <<< IMPORTANT: Update this path

const AccountabilityPartnerChatScreen = ({ navigation, route }) => {
    const { partnerName } = route.params || { partnerName: 'AI Companion' };
    const { theme, isDarkMode } = useContext(ThemeContext);
    const userId = useSelector((state) => state.auth.userId);
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.loader.isLoading);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0); // State to track keyboard height
    const scrollViewRef = useRef();

    const lottieLoadingRef = useRef(null);
    const lottieTypingRef = useRef(null);

    const getTime = () =>
        new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

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
                console.error("Chat initialization error:", error);
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

        // Keyboard listeners for dynamic marginBottom
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
    }, [userId, dispatch]);

    const handleSendMessageToBot = useCallback(
        async (messageText) => {
            if (!sessionId) return;

            setIsBotTyping(true);

            try {
                const botResponse = await sendChatbotMessage(sessionId, messageText, userId);
                const responseText = botResponse?.response || "I didn't get a clear response. Could you rephrase?";
                const responseTokens = responseText.split(" ");

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
            }
        },
        [sessionId, userId]
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

    const styles = getStyles(theme, isDarkMode, keyboardHeight); // Pass keyboardHeight to styles

    return (
        <ImageBackground source={theme.bg || bg} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Image source={back} style={styles.backIcon} />
                        </TouchableOpacity>
                        <View style={styles.partnerHeaderInfo}>
                            <Image source={chatbot} style={styles.partnerAvatar} />
                            <Text style={styles.partnerName}>{partnerName}</Text>
                        </View>
                    </View>

                    {(
                        <>
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
                                                onTypingDone={() => setIsBotTyping(false)} // ✅ Mark bot done when typing finishes
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
                                        <View style={{ ...styles.partnerMessage, paddingHorizontal: 10, paddingVertical: 0, }}>
                                            <LottieView
                                                ref={lottieTypingRef}
                                                source={typing}
                                                autoPlay
                                                loop
                                                style={styles.typingLottieAnimation}
                                            />
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
                                <TouchableOpacity
                                    onPress={handleUserSendMessage}
                                    style={styles.sendButton}
                                    disabled={isBotTyping} // disable when typing
                                >
                                    <Image
                                        source={send2}
                                        style={{
                                            width: 25,
                                            height: 25,
                                            resizeMode: 'contain',
                                            tintColor: isBotTyping ? 'gray' : theme.primaryColor // gray while disabled
                                        }}
                                    />
                                </TouchableOpacity>


                            </View>
                        </>
                    )}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
};
const TypewriterTokens = ({ tokens, textStyle, onTypingDone }) => {
    const [visibleLines, setVisibleLines] = useState([]);

    useEffect(() => {
        const fullText = tokens.join(' ');
        const lines = fullText.split(/\n|(?=\d+\.\s)/g).map(line => line.trim());

        let currentLine = 0;
        let charIndex = 0;
        let currentText = '';

        const typeNextChar = () => {
            if (currentLine >= lines.length) {
                clearInterval(interval);
                onTypingDone?.(); // ✅ Notify parent that typing is done
                return;
            }

            if (charIndex < lines[currentLine].length) {
                currentText += lines[currentLine][charIndex];
                charIndex++;

                setVisibleLines(prev => {
                    const updated = [...prev];
                    while (updated.length < lines.length) updated.push('');
                    updated[currentLine] = currentText;
                    return updated;
                });
            } else {
                currentLine++;
                charIndex = 0;
                currentText = '';
            }
        };

        const interval = setInterval(typeNextChar, 25);
        setVisibleLines(['']);

        return () => clearInterval(interval);
    }, [tokens]);

    return (
        <View>
            {visibleLines.map((line, idx) => (
                <Text key={idx} style={textStyle}>
                    {line}
                </Text>
            ))}
        </View>
    );
};


const getStyles = (theme, isDarkMode, keyboardHeight) => StyleSheet.create({
    container: { flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : 10 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.borderColor
    },
    backButton: {
        // marginRight: 10,
        padding: 5,
    },
    backIcon: {
        width: 10,
        height: 10,
        resizeMode: 'contain',
        tintColor: theme.textColor,
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
        paddingHorizontal: 20, // Explicit padding
        paddingVertical: 10,   // Explicit padding
    },
    partnerMessage: {
        fontFamily: 'Outfit-Medium',

        alignSelf: 'flex-start',
        backgroundColor: isDarkMode ? "#FFFFFF" : theme.borderColor,
        borderRadius: 15,
        borderBottomLeftRadius: 1,
        paddingHorizontal: 20, // Explicit padding
        paddingVertical: 10,   // Explicit padding
    },
    messageText: { fontSize: 13 },
    myMessageText: { color: '#FFF' },
    partnerMessageText: {
        color: !isDarkMode ? theme.subTextColor : 'black',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // Dynamic marginBottom based on keyboardHeight
        marginBottom: Platform.OS === 'ios' ? "16%" : (keyboardHeight > 0 ? 130 : 95),
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
        // marginBottom: 13,
    },
    typingLottieAnimation: {
        width: 60,
        // borderWidth: 2,
        // borderColor:"red",
        height: 40,
    },
    lottieContainer: {
        // flex: 1,
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
