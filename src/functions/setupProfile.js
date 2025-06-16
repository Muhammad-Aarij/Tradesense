import axios from 'axios';
import { API_URL } from "@env";

const setupProfile = async (profileData, userId) => {
    try {
        const response = await fetch(`${API_URL}/api/auth/setup-profile/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to setup profile');
        }

        return result;
    } catch (error) {
        console.error('Error setting up profile:', error);
        return { error: error.message };
    }
};

export default setupProfile;