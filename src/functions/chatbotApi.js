import axios from 'axios';
import { API_URL } from "@env";
// IMPORTANT: Replace with your actual API base URL


export const getChatbotSessionId = async () => {
    try {
        const response = await fetch(`${API_URL}/api/session/start`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
            throw new Error(`Failed to get session ID: ${response.status}`);
        }
        const data = await response.json();
        if (data.session_id) {
            return data.session_id;
        } else {
            console.error('Session ID not found in response data:', data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching session ID:', error);
        throw error; // Re-throw to be handled by the calling component
    }
};


export const sendChatbotMessage = async (sessionId, message) => {
    if (!sessionId) {
        console.warn('Cannot send message: Session ID is missing.');
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/api/bot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_id: sessionId,
                message: message,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
            throw new Error(`Failed to send message to bot: ${response.status}`);
        }

        const data = await response.json();
        if (data.response) {
            return data.response;
        } else {
            console.warn('Bot response field missing from API response:', data);
            return null;
        }
    } catch (error) {
        console.error('Error sending message to bot:', error);
        throw error; // Re-throw to be handled by the calling component
    }
};
