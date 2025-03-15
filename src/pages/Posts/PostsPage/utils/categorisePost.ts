import fetchFilters from "@/utils/fetchFilters";
import fileToBase64 from "./fileToBase64";
import { classifyContent } from "@/utils/geminiApiCalls";
import updateFilters from "./updateFilters";

const categorizePost = async (textContent: string, file: File | null) => {
    let base64Media = "";
    if (file) {
      // Convert file to Base64
      base64Media = await fileToBase64(file);
    }

    const filters = await fetchFilters(); // Fetch available filters

    console.log("filters : ", filters);

    const aiResponse = await classifyContent(textContent, base64Media, filters);

    const cleanResponse = aiResponse.replace(/```json|```/g, "");
    console.log("Clean reponse  : ", cleanResponse);
    const jsonData = JSON.parse(cleanResponse);

    console.log("AI response : ", jsonData);

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