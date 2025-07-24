import React, { useState, useContext, useMemo, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Image, ImageBackground
} from 'react-native';
import { acc, back, bg, fail, tick } from '../../../assets/images';
import CustomInput from '../../../components/CustomInput';
import Header from '../../../components/Header';
import { ThemeContext } from '../../../context/ThemeProvider';
import { useCreatePayment } from '../../../functions/affiliateApi';
import { useDispatch, useSelector } from 'react-redux'; // For accessing user ID from Redux (if stored there)
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import ConfirmationModal from '../../../components/ConfirmationModal';
import SnackbarMessage from '../../../functions/SnackbarMessage';


const WithdrawDetailScreen = ({ navigation, route }) => {
    const [selectedType, setSelectedType] = useState('PayPal');
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const { mutate: submitPayment, isPending } = useCreatePayment();
    const { userId } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'success' });
    const { totalAmount } = route.params;
    const [confirmation, setConfirmation] = useState({
        visible: false,
        title: '',
        message: '',
        icon: null,
    });

    useEffect(() => {
        if (snackbar.visible) {
            const timer = setTimeout(() => {
                setSnackbar(prev => ({ ...prev, visible: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [snackbar.visible]);

    const { theme } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);

    const handleSelectType = (type) => {
        setSelectedType(type);
        setDropdownVisible(false);
    };

    const isValidAccountNumber = /^\d{3}-\d{7}-\d{3}$/.test(accountNumber);

    const handleWithdraw = () => {
        const parsedAmount = parseFloat(amount);
        dispatch(startLoading());

        // Basic validation
        if (!selectedType || !accountNumber || !amount) {
            dispatch(stopLoading());
            setSnackbar({
                visible: true,
                message: 'Please fill in all details.',
                type: 'message',
            });
            return;
        }

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            dispatch(stopLoading());
            setSnackbar({
                visible: true,
                message: 'Please enter a valid amount.',
                type: 'message',
            });
            return;
        }
        if (!isValidAccountNumber) {
            dispatch(stopLoading());
            setSnackbar({
                visible: true,
                message: 'Invalid Account Number .\n Use 000-0000000-000 format.',
                type: 'message',
            });
            return;
        }
        let cleanedNumber = accountNumber.replace(/-/g, "");

        // Proceed with withdrawal
        submitPayment(
            {
                userId,
                type: selectedType.toLowerCase(),
                amount: parsedAmount,
                accountNumber: cleanedNumber,
            },
            {
                onSuccess: () => {
                    dispatch(stopLoading());
                    setConfirmation({
                        visible: true,
                        title: 'Success',
                        message: `Withdrawal of $${parsedAmount} to ${selectedType} requested.`,
                        icon: tick,
                    });
                },
                onError: () => {
                    dispatch(stopLoading());
                    setConfirmation({
                        visible: true,
                        title: 'Error',
                        message: 'Failed to submit withdrawal. Please try again.',
                        icon: fail,
                    });
                },
            }
        );
    };


    const formatAccountNumber = (input) => {
        // Remove all non-digit characters
        const digits = input.replace(/\D/g, '');

        // Format as 000-0000000-000
        const part1 = digits.slice(0, 3);
        const part2 = digits.slice(3, 10);
        const part3 = digits.slice(10, 13);

        let formatted = part1;
        if (part2) formatted += '-' + part2;
        if (part3) formatted += '-' + part3;

        return formatted;
    };


    const paymentTypes = ['PayPal', 'Google Pay', 'Bank'];

    return (
        <ImageBackground source={theme.bg} style={styles.container}>
            <SnackbarMessage visible={snackbar.visible} message={snackbar.message} type={snackbar.type} />

            <Header title="Withdraw" style={{ marginBottom: 20, }} />
            {confirmation.visible && (
                <ConfirmationModal
                    visible={confirmation.visible}
                    title={confirmation.title}
                    message={confirmation.message}
                    icon={confirmation.icon}
                    onClose={() => setConfirmation(prev => ({ ...prev, visible: false }))}
                />
            )}

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.inputLabel}>Select Type</Text>

                {/* Dropdown */}
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

                {/* Inputs */}
                <CustomInput
                    label="Account Number"
                    placeholder="Enter Account Number"
                    keyboardType="numeric"
                    value={accountNumber}
                    onChangeText={(text) => setAccountNumber(formatAccountNumber(text))} />

                <CustomInput
                    label="Amount"
                    placeholder="Enter Amount"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />

                <TouchableOpacity
                    style={[
                        styles.withdrawFinalButton,
                        (isPending || totalAmount < amount) && styles.disabledButton
                    ]}
                    onPress={handleWithdraw}
                    disabled={isPending || totalAmount < amount}
                >
                    <Text style={styles.withdrawFinalButtonText}>
                        {isPending ? 'Submitting...' : 'Withdraw'}
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </ImageBackground>
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
        padding: 25,
        paddingTop: 0,
    },
    scrollContent: {
        // justifyContent: "center",
        // alignItems: "center",
        // flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 20,
    },
    disabledButton: {
        backgroundColor: '#777', // or theme.grayColor if defined
        opacity: 0.6,
    },
    inputLabel: {
        fontFamily: "Inter-Medium",
        fontSize: 13,
        color: theme.textColor,
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
        borderWidth: 0.9,
        borderColor: theme.borderColor,
        borderRadius: 8,
        position: "relative",
    },
    dropdownSelected: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownText: {
        color: theme.textColor,
        fontFamily: "Inter-Regular",
        fontSize: 13,
    },
    dropdownArrow: {
        width: 12,
        height: 12,
        resizeMode: 'contain',
        tintColor: theme.subTextColor,
        transform: [{ rotate: '-90deg' }],
    },
    withdrawFinalButton: {
        backgroundColor: theme.primaryColor,
        width: '100%',
        padding: 15,
        borderRadius: 14,
        marginTop: 40,
        alignItems: 'center',
    },
    withdrawFinalButtonText: {
        color: '#fff',
        fontSize: 14,
        // fontWeight: '600',
        fontFamily: "Inter-Medium",
    },
    dropdownOptions: {
        position: "absolute",
        top: 60,
        left: 0,
        width: "100%",
        backgroundColor: theme.primaryColor,
        borderRadius: 8,
        zIndex: 10,
    },
    optionItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        // borderBottomWidth: 0.9,
        borderColor: theme.borderColor,
        marginHorizontal: 10,
    },
    optionText: {
        color: theme.textColor,
        fontSize: 14,
        fontFamily: "Inter-Regular",
    },
});

export default WithdrawDetailScreen;
