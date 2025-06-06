import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import theme from '../themes/theme';
const CustomInput = ({ label, placeholder, secureTextEntry, value, onChangeText, icon, onIconPress }) => {
    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.container}>
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor="#aaa"
                    secureTextEntry={secureTextEntry}
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                />
                {icon && (
                    <TouchableOpacity onPress={onIconPress} style={styles.iconButton}>
                        <Image source={icon} style={styles.icon} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        marginBottom: 15,
    },
    label: {
        fontFamily: "Inter-Medium",
        fontSize: 13,
        color: "#fff",
        marginBottom: 5,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        backgroundColor: theme.inputBackground,
        borderRadius: 8,
        borderWidth: 0.8,
        borderColor: theme.borderColor,
        paddingHorizontal: 15,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontFamily: "Inter-Regular",
        paddingVertical: 15,
    },
    iconButton: {
        position: "absolute",
        right: 15,
        padding: 5,
    },
    icon: {
        width: 20,
        height: 20,
        tintColor: "#aaa",
        resizeMode: 'contain',
    },
});

export default CustomInput;
