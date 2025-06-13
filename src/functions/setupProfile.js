import axios from 'axios';
import { API_URL } from "@env";

const setupProfile = async (profileData) => {
    try {
        const response = await fetch(`${API_URL}/api/auth/setup-profile/6833ffbf746f530daeaea011`, {
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