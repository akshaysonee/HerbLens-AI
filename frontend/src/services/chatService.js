import apiClient from "./apiClient.js";

export async function sendChatMessage({
  herbName,
  herbDetails = {},
  history = [],
  question,
}) {
  const response = await apiClient.post("/chat", {
    herbName,
    herbDetails,
    history,
    question,
  });

  return response.data?.data;
}
