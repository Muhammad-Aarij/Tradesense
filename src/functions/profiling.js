// api/goals.js
import axios from 'axios';
import { API_URL } from "@env"; // Ensure API_URL is in your .env file

export const fetchGoals = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/onboarding/questionnaire?type=goals`);
    return response.data;
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
};

export const fetchQuestionnaire = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/onboarding/questionnaire`);
    const data = response.data;
    // console.log('Questionnaire Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching questionnaire:', error.message);
    return null;
  }
};


export const fetchChosenAreas = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/onboarding/questionnaire?type=chosen-area`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chosen areas:', error);
    return [];
  }
};