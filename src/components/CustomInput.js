import React, { useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeProvider';

const CustomInput = ({ label, placeholder, secureTextEntry, value, onChangeText, icon, onIconPress, style }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <View style={styles.wrapper}>
            <Text style={[styles.label, { color: theme.textColor }]}>{label}</Text>
            <View style={[styles.container, style,{borderColor:theme.borderColor}]}>
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor="#aaa"
                    secureTextEntry={secureTextEntry}
                    style={[styles.input,{color:theme.textColor}]}
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
        fontFamily: 'Inter-Medium',
        fontSize: 13,
        // color: '#ffffff',
        marginBottom: 5,
    },
    container: {
        flexDirection: 'row',
        height: 55,
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        borderWidth: 0.9,
        borderRadius: 8,
        paddingHorizontal: 15,
    },
    input: {
        flex: 1,
        fontFamily: 'Inter-Regular',
        paddingVertical: 15,
        fontSize: 13,
    },
    iconButton: {
        position: 'absolute',
        right: 15,
        padding: 5,
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
});


export default CustomInput;
