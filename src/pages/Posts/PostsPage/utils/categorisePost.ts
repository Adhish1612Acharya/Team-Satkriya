import { classifyContent } from "@/utils/geminiApiCalls";
import convertToBase64 from "@/utils/covertToBase64";
import filters from "@/constants/filters";

const categorizePost = async (textContent: string, file: File | null) => {
    let base64Media = "";
    if (file) {
      // Convert file to Base64
      base64Media = await convertToBase64(file);
    }

    const aiResponse = await classifyContent(textContent, base64Media, filters);

    const cleanResponse = aiResponse.replace(/```json|```/g, "");
    const jsonData = JSON.parse(cleanResponse);


    return jsonData.filters || [];
  };

  export default categorizePost;