// App.js
import React, { useState, useEffect } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { View, Text, Button, StyleSheet, Alert } from 'react-native'; // Added Alert for error messages instead of console.log

const App = () => {
  const [user, setUser] = useState(null); // Initialize user state to null

  useEffect(() => {
    // Configure Google Sign-in
    GoogleSignin.configure({
      webClientId: '73808178724-socpigpmq93unoaaidav2h1pjr82gsgv.apps.googleusercontent.com', // Replace with your actual Web Client ID
      offlineAccess: true, // If you need to access Google APIs when the user is offline
      forceCodeForRefreshToken: true, // Forces a new refresh token to be issued on sign-in
    });

    // Check if the user is already signed in
    const checkUserSignIn = async () => {
      try {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
          const userInfo = await GoogleSignin.getCurrentUser();
          setUser(userInfo);
        }
      } catch (error) {
        console.error('Error checking user sign-in:', error.message);
      }
    };

    checkUserSignIn();
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to handle Google Sign-in
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices(); // Check if Google Play Services are available
      const userInfo = await GoogleSignin.signIn(); // Initiate the sign-in flow
      console.log('User Info:', userInfo); // Log user information for debugging
      setUser(userInfo); // Set the user info to state
    } catch (error) {
      console.log('Message:', error.message); // General error message
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Login Cancelled", "User cancelled the login flow."); // Replaced console.log with Alert
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Login In Progress", "Signing in is already in progress."); // Replaced console.log with Alert
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Play Services Not Available", "Google Play Services are not available or outdated."); // Replaced console.log with Alert
      } else {
        Alert.alert("Sign-in Error", `An unknown error occurred: ${error.message}`);
      }
    }
  };

  // Function to handle Google Sign-out
  const signOut = async () => {
    try {
      await GoogleSignin.signOut(); // Sign out the current user
      setUser(null); // Clear user state
      Alert.alert("Signed Out", "You have been successfully signed out.");
    } catch (error) {
      console.error('Sign-out error:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <View style={styles.loggedInContainer}>
          <Text style={styles.welcomeText}>Welcome, {user.user.name}!</Text>
          <Text style={styles.emailText}>{user.user.email}</Text>
          <Button title="Sign Out" onPress={signOut} />
        </View>
      ) : (
        <View>
          <Text style={styles.promptText}>Please sign in with Google</Text>
          <Button title="Sign In with Google" onPress={signIn} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  loggedInContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 10,
  },
  emailText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  promptText: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default App;
