import axios from "axios";
import { API_URL } from "@env";
import { getFCMToken } from "./getFCMToken";

// Function to generate a random 11-digit phone number
const generateRandomPhoneNumber = () => {
  // Generate a random 11-digit number starting with 1 (North American format)
  const firstDigit = '1';
  const remainingDigits = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
  return firstDigit + remainingDigits;
};

export const loginApi = async (email, password) => {
  const token = await getFCMToken(); // ✅ Extracted function

  console.log("Logging in with email:", email, password);
  try {
    console.log("API URL:", API_URL);
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password,
      fcmToken: token
    });
    console.log("Login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};





export const googleLoginApi = async (googleUser) => {
  const { email, familyName, givenName, photo, user } = googleUser;
  
  // Create name field - if both are empty, use "Google User" as default
  let name = '';
  if (givenName && familyName) {
    name = `${givenName} ${familyName}`;
  } else if (givenName) {
    name = givenName;
  } else if (familyName) {
    name = familyName;
  } else {
    name = 'Google User'; // Default name when no name is provided
  }

  const payload = {
    email,
    profilePic: photo,
    firstName: givenName || ' ',
    lastName: familyName || ' ',
    phone: generateRandomPhoneNumber(), // randomly generated 11-digit number
  };

  console.log("Google login api payload:", payload);

  const response = await axios.post(`${API_URL}/api/auth/register/google`, payload);
  console.log("Google login api response:", response.data);
  return response.data; // Contains token and user
};

export const appleLoginApi = async (appleUser) => {
  console.log("Apple login api response:", appleUser);

  // Extract name from Apple user data
  const givenName = appleUser.givenName || appleUser.fullName?.givenName || 'Apple';
  const familyName = appleUser.familyName || appleUser.fullName?.familyName || 'User';

  // Create name field - if both are empty, use "Apple User" as default
  let name = '';
  if (givenName && familyName) {
    name = `${givenName} ${familyName}`;
  } else if (givenName) {
    name = givenName;
  } else if (familyName) {
    name = familyName;
  } else {
    name = 'Apple User'; // Default name when no name is provided
  }

  const payload = {
    email: appleUser.email,
    profilePic: null,
    firstName: givenName,
    lastName: familyName,
    phone: generateRandomPhoneNumber(), // randomly generated 11-digit number
  };
  try {
    const response = await axios.post(`${API_URL}/api/auth/register/google`, payload);
    console.log("Apple login api response:", response.data);
    return response.data; // Contains token and user
  } catch (error) {
    console.error("Apple login api error:", error.response?.data || error.message || error);
    throw error;
  }
};



export const requestAccountDeletion = async ({ userId, reason }) => {
  console.log("Deleteing User Request", userId, reason);
  try {
    const response = await axios.post(`${API_URL}/api/delete/requests`, {
      "userId": userId,
      "reason": reason,
    });

    console.error('Account  request :', response.data);
    return response.data;
  } catch (error) {
    // console.error('Account deletion request failed:', error.response.data);
    throw error;
  }
}