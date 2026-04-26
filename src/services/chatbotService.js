import { API_BASE_URL } from "../constants";

export const askAiChatbot = async (message, history = []) => {
  const response = await fetch(`${API_BASE_URL}/chatbot/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      history,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to ask chatbot");
  }

  const data = await response.json();
  return {
    reply: data.reply || "Xin loi, hien tai toi chua the tra loi. Ban vui long thu lai.",
    suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
  };
};
