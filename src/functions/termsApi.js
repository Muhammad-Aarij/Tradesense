import { API_URL } from "@env";

export const fetchTerms = async () => {
    try {
        const response = await fetch(`${API_URL}/api/terms`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
            throw new Error(`Failed to fetch Terms and Conditions: ${response.status}`);
        }
        const data = await response.json();
        // Assuming the API returns an array, and we only need the first item
        if (data && data.length > 0 && data[0].content) {
            return data[0]; // Return the first object which contains title and content
        } else {
            console.error('Terms and Conditions data not found in response:', data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching Terms and Conditions:', error);
        throw error; // Re-throw to be handled by the calling component
    }
};
