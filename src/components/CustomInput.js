import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeProvider';

const CustomInput = ({
    label,
    placeholder,
    secureTextEntry,
    value,
    onChangeText,
    icon,
    onIconPress,
    isMultiline = false,
    style,
    ...props
}) => {
    const { theme } = useContext(ThemeContext);
    const [inputHeight, setInputHeight] = useState(100);

    return (
        <View style={styles.wrapper}>
            {label && <Text style={[styles.label, { color: theme.textColor }]}>{label}</Text>}

            <View
                style={[
                    styles.container,
                    style,
                    {
                        borderColor: theme.borderColor,
                        height: isMultiline ? undefined : 55,
                        paddingVertical: isMultiline ? 8 : 0,
                        alignItems: isMultiline ? 'flex-start' : 'center',
                    },
                ]}
            >
                <TextInput
                    {...props}
                    multiline={isMultiline}
                    placeholder={placeholder}
                    placeholderTextColor={theme.subTextColor}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize="none"
                    style={[
                        styles.input,
                        {
                            color: theme.textColor,
                            height: isMultiline ? Math.max(100, inputHeight) : '100%',
                            textAlignVertical: isMultiline ? 'top' : 'center',
                        },
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    onContentSizeChange={(e) => {
                        if (isMultiline) {
                            setInputHeight(e.nativeEvent.contentSize.height + 10);
                        }
                    }}
                />
                {icon && (
                    <TouchableOpacity onPress={onIconPress} style={styles.iconButton}>
                        <Image source={icon} style={[styles.icon, { tintColor: theme.subTextColor }]} />
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
        fontSize: 12,
        marginBottom: 5,
    },
    container: {
        flexDirection: 'row',
        width: '100%',
        position: 'relative',
        borderWidth: 0.9,
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    input: {
        flex: 1,
        fontFamily: 'Inter-Regular',
        fontSize: 13,
        paddingRight: 35,
    },
    iconButton: {
        position: 'absolute',
        right: 15,
        top: 15,
        padding: 5,
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
});

export default CustomInput;
