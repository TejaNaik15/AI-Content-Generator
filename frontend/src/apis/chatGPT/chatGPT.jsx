import axios from "axios";
//=======Registration=====

export const generateContentAPI = async (userPrompt) => {
  const response = await axios.post(
    "http://localhost:3000/api/v1/ai/generate-content",
    {
      prompt: userPrompt,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};