import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView
} from 'react-native';
import { bg, lock } from '../../../assets/images';
import CustomInput from '../../../components/CustomInput';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { sendOTP } from '../../../functions/otpService';
import { ThemeContext } from '../../../context/ThemeProvider';

const { width, height } = Dimensions.get('window');

const ForgetPassword = ({ navigation }) => {
  const dispatch = useDispatch();
  const { theme, isDarkMode } = useContext(ThemeContext);

  const [email, setEmail] = useState('');

  const handleVerify = async () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    try {
      dispatch(startLoading());
      const response = await sendOTP(email, false);
      console.log("Reset email sent:", response);
      dispatch(stopLoading());
      alert("Password reset email sent successfully");
      navigation.navigate("EmailVerification", {
        email: email,
        status: "forget",
        token: response.token
      });
    } catch (error) {
      dispatch(stopLoading());
      console.error("Error sending reset email:", error);
      alert("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <ImageBackground source={theme.bg} style={[styles.container, { backgroundColor: theme.darkBlue }]}>
      <Image source={lock} style={styles.image} />
      <View style={[styles.bottomcontainer, { backgroundColor: isDarkMode ? theme.darkBlue : "white" }]}>
        <Text style={[styles.title, { color: theme.textColor }]}>Forgot Password</Text>
        <Text style={[styles.subtitle, { color: theme.subTextColor }]}>Enter your email address</Text>

        <CustomInput
          placeholder="Enter your Email Address"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primaryColor }]} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  bottomcontainer: {
    flex: 1,
    width: width,
    paddingHorizontal: width * 0.1,
    borderTopLeftRadius: width * 0.08,
    borderTopRightRadius: width * 0.08,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: height * 0.03,
  },
  image: {
    width: width * 0.55,
    height: width * 0.45,
    resizeMode: 'contain',
    marginTop: height * 0.015,
  },
  title: {
    fontSize: width * 0.07,
    fontFamily: 'Inter-SemiBold',
    marginTop: height * 0.03,
    marginBottom: height * 0.015,
  },
  subtitle: {
    fontSize: width * 0.035,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  button: {
    width: '100%',
    padding: height * 0.017,
    borderRadius: width * 0.04,
    marginTop: height * 0.02,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.041,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});

export default ForgetPassword;
