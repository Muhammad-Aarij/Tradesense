import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
	GOOGLE_WEB_CLIENT_ID,
	GOOGLE_ANDROID_CLIENT_ID,
	GOOGLE_IOS_CLIENT_ID,
} from '@env';

GoogleSignin.configure({
	webClientId: "73808178724-socpigpmq93unoaaidav2h1pjr82gsgv.apps.googleusercontent.com",
	iosClientId: GOOGLE_IOS_CLIENT_ID,
	scopes: ['profile', 'email'],
});

const GoogleLogin = async () => {
	await GoogleSignin.hasPlayServices();
	const userInfo = await GoogleSignin.signIn();
	return userInfo;
};

export default function App() {
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleGoogleLogin = async () => {
		setLoading(true);
		try {
			const response = await GoogleLogin();
			const { idToken, user } = response;

			if (idToken) {
				const resp = await authAPI.validateToken({
					token: idToken,
					email: user.email,
				});
				await handlePostLoginData(resp.data);
			}
		} catch (apiError) {
			setError(
				apiError?.response?.data?.error?.message || 'Something went wrong'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View>
			<Pressable onPress={handleGoogleLogin}>Continue with Google</Pressable>
		</View>
	);
}