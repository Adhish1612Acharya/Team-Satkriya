// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Initialize the API with your Gemini API Key
// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// // Define the model
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// type classifyConetntCalls= (content:string,
//     media:string | null,
//     existingFilters:{
//         [key:string]:string[];
//     })=>Promise<string>;

// export const  classifyContent:classifyConetntCalls=async (content, media, existingFilters)=>{
//     const result = await model.generateContent({
//       contents: [
//     {
//         role: "user",
//         parts: [
//             {
//                 text: `
//                 You are an AI assistant specializing in content classification.
//                 Your task is to categorize a given post into one or more predefined filters.

//                 ### **Input Data**
//                 - Post Description: "${content}"
//                 - Media (image, document, or video): "${media}" 
//                 - Available Filters: ${JSON.stringify(existingFilters)}

//                 ### **Task Requirements**
//                 1. **Match Existing Filters**:  
//                    - Identify and return the most relevant filters from the provided list.
//                - Ensure the selected filters match the post's context and are valid sub-filters under their respective main filters.
                
//                 2. **Suggest New Filters (If Necessary)**:  
//                    - If no existing filter matches, create a new **main filter** and **sub-filter** based on the post’s context.
//                    - If a main filter exists but lacks a relevant sub-filter, propose a new sub-filter under it.
//                    - If all filters are sufficient, return "newFilter": null.

//                 3. **Ensure JSON Validity**:  
//                    - **Return only a JSON object** with no additional text, markdown, or formatting.  
//                    - The response **must be a parsable JSON** without backticks or code blocks.

//                 ### **Expected JSON Response Format**
//                 {
//                     "filters": ["Existing Sub-Filter 1", "Existing Sub-Filter 2"],
//                     "newFilter": {
//                         "new Main Filter":{
//                         selectType:"single" || "double",
//                         subFilters:["sub-filter1","sub-filter2"]
//                         }
//                     }
//                 }

//                 - If no new filter is needed, return "newFilter": null.
//                 - The "filters" array should only contain **relevant** existing filters.
//                 - The response **must not** include explanations, markdown syntax, or introductory text.
                
//                  **IMPORTANT:** Do not include any markdown formatting, code blocks, or additional text—return only a pure JSON object without backticks, explanations, or surrounding text.
//                 `
//             }
//         ]
//     }
// ]

//       });

//   // Extract and return the response
//   const response = await result.response;
//   return response.text();
// }

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with your Gemini API Key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Define the model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

type ClassifyContentCalls = (
  content: string,
  media: string | null,
  existingFilters: {
    [key: string]: {
      selectType: "single" | "double";
      subFilters: string[];
    };
  }
) => Promise<string>;

export const classifyContent: ClassifyContentCalls = async (
  content,
  media,
  existingFilters
) => {
  try {
    const prompt = `
    You are an AI assistant specializing in content classification.
    Your task is to categorize a given post into one or more predefined filters.

    ### **Input Data**
    - Post Description: "${content}"
    - Media (image, document, or video): "${media}" 
    - Available Filters: ${JSON.stringify(existingFilters)}

    ### **Task Requirements**
    1. **Match Existing Filters**:  
       - If the post matches an existing main filter, return only the relevant sub-filters in the "filters" array.
       - Example: If the post matches "AgriculturalPractices", return ["Zero-Budget Farming", "Natural Fertilizers"].

    2. **Suggest New Sub-Filters (If Necessary)**:  
       - If the post matches an existing main filter but requires a new sub-filter, return:
         {
           "filters": ["Existing Sub-Filter 1", "Existing Sub-Filter 2"],
           "newFilter": {
             "selectType": "same as the main filter",
             "subFilters": ["new-sub-filter-1", "new-sub-filter-2"]
           }
         }

    3. **Suggest Completely New Filters (If Necessary)**:  
       - If the post does not match any existing main filter, suggest a completely new main filter:
         {
           "filters": [],
           "newFilter": {
             "newMainFilter": {
               "selectType": "single" || "double",
               "subFilters": ["new-sub-filter-1", "new-sub-filter-2"]
             }
           }
         }

    4. **Understand selectType**:  
       - **selectType: "single"**: For this main filter, only **one sub-filter** can be chosen at a time while searching posts.
       - **selectType: "double"**: For this main filter, **multiple sub-filters** can be chosen at a time while searching posts.
       - Ensure that any new sub-filters or main filters you suggest respect the \`selectType\` of the existing or new main filter.

    5. **Ensure JSON Validity**:  
       - **Return only a JSON object** with no additional text, markdown, or formatting.  
       - The response **must be a parsable JSON** without backticks or code blocks.

    ### **Expected JSON Response Format**
    {
        "filters": ["Existing Sub-Filter 1", "Existing Sub-Filter 2"],
        "newFilter": {
            "selectType": "same as the main filter" || "single" || "double",
            "subFilters": ["new-sub-filter-1", "new-sub-filter-2"]
        }
    }

    - If no new filter is needed, return "newFilter": null.
    - The "filters" array should only contain **relevant** existing sub-filters.
    - The response **must not** include explanations, markdown syntax, or introductory text.

    **IMPORTANT:** Do not include any markdown formatting, code blocks, or additional text—return only a pure JSON object without backticks, explanations, or surrounding text.
    `;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    // Extract and return the response
    const response = await result.response;
    return response.text(); // Ensure this returns a string
  } catch (error) {
    console.error("Error generating content: ", error);
    throw new Error("Failed to classify content.");
  }
};