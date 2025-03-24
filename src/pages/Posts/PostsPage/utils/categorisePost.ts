import { classifyContent } from "@/utils/geminiApiCalls";
import updateFilters from "./updateFilters";
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


    if (jsonData.newFilter !== null) {
      await updateFilters(filters, jsonData.newFilter);
    }

    let aiFilters: string[] = [];

    if (jsonData.newFilter) {
      Object.keys(jsonData.newFilter).forEach((newMainFilter) => {
        aiFilters.push(...jsonData.newFilter[newMainFilter].subFilters);
      });
    }

    if (jsonData.filters && Array.isArray(jsonData.filters) && jsonData.filters.length>0) {
      aiFilters.push(...jsonData.filters);
    }

    const postfilters: string[] = [...new Set(aiFilters)];

    console.log("Post Filters : ", postfilters);

    return postfilters;
  };

  export default categorizePost;