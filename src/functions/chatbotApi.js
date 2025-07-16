// functions/chatbotApi.js

import { API_URL } from "@env";

// 1. Start a new chatbot session
export const getChatbotSessionId = async () => {
  try {
    const response = await fetch(`${API_URL}/api/session/start`);
    if (!response.ok) throw new Error("Failed to get session ID");

    const data = await response.json();
    return data.session_id || null;
  } catch (error) {
    console.error("Session fetch error:", error);
    return null;
  }
};
export const sendChatbotMessage = async (sessionId, message, userId) => {
  try {
    const response = await fetch(`${API_URL}/api/bot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, message, userId }),
    });

    if (!response.ok) throw new Error("Bot message send failed");

    const data = await response.json();

    // Expecting backend to return { response: "Full message", tokens: ["word1", "word2", ...] }
    return {
      response: data.response || "",
      tokens: data.tokens || data.response?.split(" ") || []
    };
  } catch (error) {
    console.error("sendChatbotMessage error:", error);
    throw error;
  }
};

export const getChatbotHistory = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/api/bot/${userId}`);
    if (!response.ok) throw new Error("Failed to get history");

    const data = await response.json();
    
    // --- CORRECTION START ---
    // The `data` itself is an array, not `data.messages` based on your provided response.
    const history = Array.isArray(data)
      ? data.flatMap((entry) => [ // Use 'data' directly here
          {
            text: entry.message,
            sender: 'me',
            timestamp: entry.createdAt,
            sessionId: entry.sessionId,
          },
          {
            text: entry.response,
            sender: 'bot',
            timestamp: entry.createdAt,
            sessionId: entry.sessionId,
          },
        ])
      : [];
    // --- CORRECTION END ---
    console.log("History  Data:", history); // Log the raw data to confirm its structure
    
    return history;
  } catch (error) {
    console.error("getChatbotHistory error:", error);
    return [];
  }
};