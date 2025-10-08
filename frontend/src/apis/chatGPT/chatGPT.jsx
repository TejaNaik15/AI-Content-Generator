import api from "../axiosConfig";
//=======Registration=====

export const generateContentAPI = async (userPrompt) => {
  const response = await api.post(
    "/api/v1/ai/generate-content",
    {
      prompt: userPrompt,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};
