import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { back, bg } from '../../../assets/images';
import CustomInput from '../../../components/CustomInput';
import Header from '../../../components/Header';
import theme from '../../../themes/theme';

const WithdrawDetailScreen = () => {
    // const navigation = useNavigation();

    const [selectedType, setSelectedType] = useState('PayPal'); // Default selected type
    const [accountNumber, setAccountNumber] = useState('1235'); // Pre-filled
    const [amount, setAmount] = useState('459.58'); // Pre-filled
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const handleSelectType = (type) => {
        setSelectedType(type);
        setDropdownVisible(false); // Close dropdown after selection
    };


    const handleWithdraw = () => {
        if (!selectedType || !accountNumber || !amount) {
            Alert.alert('Error', 'Please fill in all details.');
            return;
        }
        // Basic validation
        if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            Alert.alert('Error', 'Please enter a valid amount.');
            return;
        }
        // In a real app, you'd send this to your backend/payment service
        Alert.alert('Withdrawal Request', `Withdrawal of $${amount} to ${selectedType} account ${accountNumber} requested.`);
        if (navigation && navigation.popToTop) {
            navigation.popToTop(); // Go back to the main screen
        } else {
            console.warn("Navigation popToTop not available.");
        }
    };

    // Mock dropdown options
    const paymentTypes = ['PayPal', 'Google Pay', 'Bank'];

    return (
        <ImageBackground source={bg} style={styles.container}>
            <Header title={"Withdraw"} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Select Type (Dropdown mock) */}
                <Text style={styles.inputLabel}>Select Type</Text>
                <View style={{ position: "relative" }}>
                    <TouchableOpacity style={styles.dropdownContainer} onPress={() => setDropdownVisible(!dropdownVisible)}>
                        <View style={styles.dropdownSelected}>
                            <Text style={styles.dropdownText}>{selectedType}</Text>
                        </View>
                        <Image source={back} style={styles.dropdownArrow} />
                    </TouchableOpacity>

                    {dropdownVisible && (
                        <View style={styles.dropdownOptions}>
                            {paymentTypes.map((type) => (
                                <TouchableOpacity key={type} style={styles.optionItem} onPress={() => handleSelectType(type)}>
                                    <Text style={styles.optionText}>{type}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>


                {/* Account Number */}
                <CustomInput
                    label="Account Number"
                    placeholder="Enter Account Number"
                    keyboardType="numeric"
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                />

                <CustomInput
                    label="Amount"
                    placeholder="Enter Amount"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />


                {/* Join Button (changed to Withdraw) */}
                <TouchableOpacity style={styles.withdrawFinalButton} onPress={handleWithdraw}>
                    <Text style={styles.withdrawFinalButtonText}>Join</Text> {/* Text matches image "Join" */}
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#08131F', padding: 25, paddingTop: 0 },

    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 20,
    },
    inputLabel: {
        fontFamily: "Inter-Medium",
        fontSize: 13,
        color: "#fff",
        marginBottom: 5,
    },
    dropdownContainer: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9, borderColor: theme.borderColor,
        borderRadius: 8,
        position: "relative",
    },
    dropdownSelected: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginRight: 10,
        tintColor: '#FFFFFF', // Assuming icons can be tinted
    },
    dropdownText: {
        color: '#fff',
        fontFamily: "Inter-Regular",
        // paddingVertical: 15,
        fontSize: 13,
    },
    dropdownArrow: {
        width: 12,
        height: 12,
        resizeMode: 'contain',
        tintColor: '#CCCCCC',
        transform: [{ rotate: '-90deg' }],
    },

    textInput: {
        backgroundColor: '#1C2B3A',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 15,
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: "Inter-Regular",
        marginBottom: 15,
    },
    withdrawFinalButton: {
        backgroundColor: theme.primaryColor, width: '100%',
        padding: 15, borderRadius: 14, marginTop: 40, alignItems: 'center'
    },
    withdrawFinalButtonText: {
        color: '#fff', fontSize: 17, fontWeight: '600', fontFamily: "Inter-SemiBold",
    },


    dropdownOptions: {
        position: "absolute",
        top: 60, // Adjust based on your dropdown's location
        left: 0, // Align with dropdown button
        width: "100%", // Match dropdown width
        backgroundColor: "#08131F",
        borderRadius: 8,
        // paddingVertical: 10,
        zIndex: 10, // Ensures it stays above other elements
    },

    optionItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 0.9, borderColor: theme.borderColor,
        marginHorizontal: 10
    },

    optionText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: "Inter-Regular",
    },

});

export default WithdrawDetailScreen;
