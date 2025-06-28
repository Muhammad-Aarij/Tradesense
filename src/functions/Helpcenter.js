import axios from "axios";
import { API_URL } from "@env"; // Ensure API_URL is in your .env file

export const fetchFAQs = async () => {
    try {
        const response = await fetch(`${API_URL}/api/faq`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
            throw new Error(`Failed to fetch FAQs: ${response.status}`);
        }
        const data = await response.json();
        return data; // Assuming the API returns the array directly
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        throw error; // Re-throw to be handled by the calling component
    }
};
