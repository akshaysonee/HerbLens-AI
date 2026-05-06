import apiClient from "./apiClient.js";

export async function sendChatMessage({
  herbName,
  herbDetails = {},
  history = [],
  question,
  activeModel,
}) {
  const response = await apiClient.post("/chat", {
    herbName,
    herbDetails,
    history,
    question,
    activeModel,
  });

  return response.data?.data;
}
