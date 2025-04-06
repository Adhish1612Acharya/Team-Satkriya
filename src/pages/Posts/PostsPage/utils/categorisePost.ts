import { classifyContent } from "@/utils/geminiApiCalls";
import filters from "@/constants/filters";

const categorizePost = async (textContent: string, base64Media: string) => {
  const aiResponse = await classifyContent(textContent, base64Media, filters);

  const cleanResponse = aiResponse.replace(/```json|```/g, "");
  const jsonData = JSON.parse(cleanResponse);

  return jsonData.filters || [];
};

export default categorizePost;
