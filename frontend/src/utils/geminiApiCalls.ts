import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with your Gemini API Key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Define the model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

type classifyConetntCalls= (content:string,
    media:string | null,
    existingFilters:{
        [key:string]:string[];
    })=>Promise<string>;

export const  classifyContent:classifyConetntCalls=async (content, media, existingFilters)=>{
    const result = await model.generateContent({
      contents: [
    {
        role: "user",
        parts: [
            {
                text: `
                You are an AI assistant specializing in content classification.
                Your task is to categorize a given post into one or more predefined filters.

                ### **Input Data**
                - Post Description: "${content}"
                - Media (image, document, or video): "${media}" 
                - Available Filters: ${JSON.stringify(existingFilters)}

                ### **Task Requirements**
                1. **Match Existing Filters**:  
                   - Identify and return the most relevant filters from the provided list.
                
                2. **Suggest New Filters (If Necessary)**:  
                   - If no existing filter matches, create a new **main filter** and **sub-filter** based on the post’s context.
                   - If a main filter exists but lacks a relevant sub-filter, propose a new sub-filter under it.
                   - If all filters are sufficient, return "newFilter": null.

                3. **Ensure JSON Validity**:  
                   - **Return only a JSON object** with no additional text, markdown, or formatting.  
                   - The response **must be a parsable JSON** without backticks or code blocks.

                ### **Expected JSON Response Format**
                {
                    "filters": ["Existing Sub-Filter 1", "Existing Sub-Filter 2"],
                    "newFilter": {
                        "new Main Filter":["sub-filter1","sub-filter2"]
                    }
                }

                - If no new filter is needed, return "newFilter": null.
                - The "filters" array should only contain **relevant** existing filters.
                - The response **must not** include explanations, markdown syntax, or introductory text.
                
                 **IMPORTANT:** Do not include any markdown formatting, code blocks, or additional text—return only a pure JSON object without backticks, explanations, or surrounding text.
                `
            }
        ]
    }
]

      });

  // Extract and return the response
  const response = await result.response;
  return response.text();
}

