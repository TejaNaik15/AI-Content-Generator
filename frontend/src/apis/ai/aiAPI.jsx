import api from "../axiosConfig";

export const generateContentAPI = async (prompt) => {
  try {
    const response = await api.post(
      "/api/v1/ai/generate-content",
      {
        prompt,
      },
      {
        withCredentials: true,
      }
    );
    return response?.data;
  } catch (err) {
    if (!err.response) {
      throw new Error("Network error: failed to reach AI service");
    }
    throw err;
  }
};

export const checkAIStatusAPI = async () => {
  try {
    const response = await api.get(
      "/api/v1/ai/status",
      {
        withCredentials: true,
      }
    );
    return response?.data;
  } catch (err) {
    if (!err.response) {
      throw new Error("Network error: failed to reach AI service");
    }
    throw err;
  }
};
