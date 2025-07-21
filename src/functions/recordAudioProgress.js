import axios from 'axios';
import { API_URL } from '@env';

/**
 * Record audio progress for a user and resource.
 * @param {Object} params
 * @param {string} params.userId - The user's ID
 * @param {string} params.resourceId - The resource/audio ID
 * @param {number} params.currentTime - The current playback time in seconds or ms
 * @returns {Promise<Object>} API response or error object
 */
export const recordAudioProgress = async ({ userId, resourceId, currentTime }) => {
  console.log("recordAudioProgress", userId, resourceId, currentTime);
  try {
    const response = await axios.post(`${API_URL}/api/resource/progress`, {
      userId,
      resourceId,
      currentTime,
    });
    return response.data;
  } catch (error) {
    console.error('Error recording audio progress:', error.response?.data || error.message);
    return { error: true, details: error.response?.data || error.message };
  }
}; 