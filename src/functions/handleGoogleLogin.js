
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../redux/slice/loaderSlice';
import { API_URL } from '@env';

export const useGoogleSignIn = () => {
  const dispatch = useDispatch();

  const signInWithGoogle = async () => {
    try {
      dispatch(startLoading());

      // Ensure device has Google Play Services
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Start Google sign-in process
      const userInfo = await GoogleSignin.signIn();

      const { idToken } = await GoogleSignin.getTokens(); // Get ID token for backend verification

      // Optionally: send idToken to your backend to verify & create a user session
      // const response = await axios.post(`${API_URL}/auth/google-login`, {
      //   idToken: idToken,
      // });

      // Do something with the response, e.g., store user info in Redux or AsyncStorage
      console.log('Login successful:', response.data);

    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('In Progress', 'Sign-in already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services Not Available', 'Please update Google Play Services');
      } else {
        Alert.alert('Error', error.message || 'Something went wrong during sign-in');
      }
    } finally {
      dispatch(stopLoading());
    }
  };

  return { signInWithGoogle };
};
