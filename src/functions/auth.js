import axios from "axios";
import { API_URL } from "@env";
import { getFCMToken } from "./getFCMToken";

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
  const payload = {
    email,
    profilePic: photo,
    firstName: givenName || '',
    lastName: familyName || '',
    phone: user?.phone || '', // optional
  };

  const response = await axios.post(`${API_URL}/api/auth/register/google`, payload);
  console.log("Google login api response:", response.data);
  return response.data; // Contains token and user
};

