import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ImageBackground } from 'react-native';
import Header from '../../../components/Header';
import { bg } from '../../../assets/images';
import theme from '../../../themes/theme';
import CustomInput from '../../../components/CustomInput';
// import { useNavigation, useRoute } from '@react-navigation/native';


const CheckoutScreen = () => {
    // const navigation = useNavigation();
    // const route = useRoute();
    // const { selectedPlan } = route.params || { selectedPlan: 'single' }; // Get selected plan
    const { selectedPlan } = 'single'

    const [paymentType, setPaymentType] = useState('full'); // 'full' or 'installments'
    const [cardType, setCardType] = useState(''); // E.g., 'Visa', 'MasterCard'
    const [cardHolder, setCardHolder] = useState('Alwin Smith'); // Pre-filled as in image
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState(''); // MM/YY
    const [cvc, setCvc] = useState('589'); // Pre-filled as in image

    const handleJoinPress = () => {
        // Basic validation
        if (!cardType || !cardHolder || !cardNumber || !cardExpiry || !cvc) {
            Alert.alert('Error', 'Please fill in all card details.');
            return;
        }
        if (cardNumber.replace(/\s/g, '').length !== 16 || isNaN(cardNumber.replace(/\s/g, ''))) {
            Alert.alert('Error', 'Please enter a valid 16-digit card number.');
            return;
        }
        if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            Alert.alert('Error', 'Please enter card expiry in MM/YY format.');
            return;
        }
        if (cvc.length !== 3 || isNaN(cvc)) {
            Alert.alert('Error', 'Please enter a valid 3-digit CVC.');
            return;
        }

        // In a real application, you would send this data to a payment gateway
        Alert.alert('Success', `Payment for ${selectedPlan} plan submitted!`);
        // Navigate back to home or a confirmation screen
        if (navigation && navigation.popToTop) {
            navigation.popToTop(); // Go back to the first screen in the stack
        } else {
            console.warn("Navigation popToTop not available.");
        }
    };

    const formatCardNumber = (text) => {
        // Remove all non-digit characters
        const cleanText = text.replace(/\D/g, '');
        // Insert space every 4 digits
        const formattedText = cleanText.replace(/(\d{4})/g, '$1 ').trim();
        setCardNumber(formattedText);
    };

    const formatCardExpiry = (text) => {
        // Remove all non-digit characters
        let cleanText = text.replace(/\D/g, '');
        // Add '/' after the second digit for MM/YY format
        if (cleanText.length > 2) {
            cleanText = cleanText.substring(0, 2) + '/' + cleanText.substring(2, 4);
        }
        setCardExpiry(cleanText);
    };

    return (
        <ImageBackground source={bg} style={styles.container}>
            {/* Header */}
            <Header title={"Checkout"} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Payment Type Selection */}
                <View style={styles.paymentTypeContainer}>
                    <TouchableOpacity
                        style={[styles.radioOption, paymentType === 'full' && styles.radioOptionSelected]}
                        onPress={() => setPaymentType('full')}
                    >
                        <View style={[styles.radioCircle, paymentType === "full" && { borderColor: theme.primaryColor }]}>
                            {paymentType === 'full' && <View style={styles.selectedRadioFill} />}
                        </View>
                        <Text style={styles.radioText}>Full Payment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.radioOption, paymentType === 'installments' && styles.radioOptionSelected]}
                        onPress={() => setPaymentType('installments')}
                    >
                        <View style={[styles.radioCircle, paymentType === "installments" && { borderColor: theme.primaryColor }]}>
                            {paymentType === 'installments' && <View style={styles.selectedRadioFill} />}
                        </View>
                        <Text style={styles.radioText}>3 Installments</Text>
                    </TouchableOpacity>
                </View>

                {/* Payment Details Form - Using CustomInput */}
                <View style={styles.formContainer}>
                    <CustomInput
                        label="Card Type"
                        placeholder="Visa"
                        value={cardType}
                        onChangeText={setCardType}
                    />

                    <CustomInput
                        label="Card Holder"
                        placeholder="Alwin Smith"
                        value={cardHolder}
                        onChangeText={setCardHolder}
                    />

                    <CustomInput
                        label="Card Number"
                        placeholder="---- ---- ---- ----"
                        keyboardType="numeric"
                        maxLength={19}
                        value={cardNumber}
                        onChangeText={formatCardNumber}
                    />

                    <View style={styles.rowInputs}>
                        <View style={styles.halfInput}>
                            <CustomInput
                                label="Card Expiry"
                                placeholder="MM/YY"
                                keyboardType="numeric"
                                maxLength={5}
                                value={cardExpiry}
                                onChangeText={formatCardExpiry}
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <CustomInput
                                label="CVC"
                                placeholder="XXX"
                                keyboardType="numeric"
                                maxLength={3}
                                value={cvc}
                                onChangeText={setCvc}
                            />
                        </View>
                    </View>
                </View>

                {/* Join Button */}
                <TouchableOpacity style={styles.joinButton} onPress={handleJoinPress}>
                    <Text style={styles.joinButtonText}>Join</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        paddingBottom: 0,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 30, // Extra space at the bottom for scroll
    },
    paymentTypeContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        marginBottom: 25,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingVertical: 12,
        justifyContent: 'center',
        borderRadius: 8,
    },
    radioOptionSelected: {
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#FFFFFF",
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    selectedRadioFill: {
        height: 10,
        width: 10,
        borderRadius: 50,
        backgroundColor: theme.primaryColor,
    },
    radioText: {
        color: '#FFFFFF',
        fontFamily: "Inter-Regular",
        fontSize: 14,
    },
    formContainer: {
        flex: 1,
        height: "100%",
    },
    inputLabel: {
        color: '#FFFFFF',
        fontSize: 13,
        marginBottom: 8,
        fontFamily: "Inter-Medium",
    },
    // Removed old TextInput styles as CustomInput handles them
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        flex: 0.48, // Roughly half, accounting for spacing
    },
    joinButton: {
        backgroundColor: theme.primaryColor,
        width: '100%',
        padding: 12,
        borderRadius: 11,
        marginTop: 20,
        alignItems: 'center',
    },
    joinButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        fontFamily: "Inter-SemiBold",
    },
});

export default CheckoutScreen;
