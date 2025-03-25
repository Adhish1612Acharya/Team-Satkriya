import Post from "@/types/posts.types";
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

type findRelavantContentCall = (
  query: string,
  media: string[],
  allPosts: Post[],
  allWebinars: any[]
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

export const findRelevantContent: findRelavantContentCall = async (
  query,
  media,
  existingPosts,
  webinarsAndWorkShopsData
) => {
  try {
    console.log({
      workshops: webinarsAndWorkShopsData,
      posts:existingPosts
    })
    const prompt = `
    You are an AI assistant specializing in agriculture and indigenous cow farming. Your task is to find the most relevant existing posts and webinars based on a farmer’s query.

   ### **Input Data**
    - **Farmer's Query**: "${query}"
    - **Uploaded Media (if any)**: "${media}" 
    - **Existing Posts**: ${JSON.stringify(existingPosts)}
    - **Available Webinars & Workshops**: ${JSON.stringify( webinarsAndWorkShopsData)}

    ### **Task Instructions**
    1. **Find Relevant Posts**  
       - Search the \`existingPosts\` dataset for the most relevant posts related to the farmer’s query.  
       - Return **up to 3 posts** sorted by relevance.  
       - If multiple posts are equally relevant, prioritize those **verified by experts** and **highly liked by other farmers**.  

   2. **Find Top 3 Related Events**  
   - Search both "webinars" and "workshops" collections  from  ${webinarsAndWorkShopsData}
   - Prioritize:  
     a) Upcoming events (date >= today)  
     b) Events with matching titles/descriptions  
     c) Events by verified organizations  
   - Return maximum 3 events (mix of webinars/workshops)

    3. **Handling No Relevant Posts**  
       - If **no relevant posts exist**, return \`"noPostsExist": true\`.  
       - Include a message: \`"No relevant posts found. You can ask a veterinary doctor."\`  
       - Do NOT make up a response; only return results from the dataset.

    ### **Expected JSON Response Format**
    {
      "relevantPosts": ["postId1", "postId2", "postId3"],
      "relevantWebinars": ["webinarId1", "webinarId2"],
      "noPostsExist": false
    }

    - If no posts are found, return:
    {
      "relevantPosts": [],
      "relevantWebinars": [],
      "noPostsExist": true,
      "message": "No relevant posts found. You can ask a veterinary doctor."
    }

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
    throw new Error("Failed to find relevant content.");
  }
};

export const validateAndFilterWebinar = async (
 webinarDetails:{title:string;description:string},
  thumbnailBase64: string,
  webinarFilters: any
):Promise<string | null> => {
  try {
    const prompt = `
    You are an AI assistant specializing in indigenous cow dairy farming. Your task is to:
    1. Validate if a webinar is relevant to indigenous cow dairy farming
    2. If relevant, apply predefined filters to categorize the webinar

    ### Input Data
    - Webinar Details: ${JSON.stringify(webinarDetails)}
    - Thumbnail (Base64): ${thumbnailBase64}
    - Predefined Filters: ${JSON.stringify(webinarFilters)}

    ### Task Instructions
    1. **Relevance Validation**:
       - Analyze the webinar title, description, and thumbnail (if provided)
       - The content must specifically relate to dairy farming through indigenous cows
       - Specific mention of indigenous/desi cow breeds (Gir, Sahiwal, Red Sindhi, etc.)
       - Focus on dairy farming aspects (milk production, breeding, health management)
       - Traditional or sustainable dairy practices
       - Return \`valid: false\` if:
         * Content is about general agriculture without dairy focus
         * Focuses on non-indigenous cattle breeds
         * Contains irrelevant commercial content
    
     2. **Thumbnail Must Show** (if provided):
       - Indigenous cow breeds (not hybrid or foreign breeds)
       - Dairy farming scenes (milking, feeding, cattle sheds)
       - Relevant equipment (traditional milking utensils, organic feed)
       - Reject if shows:
         * Poultry or other livestock
         * Commercial dairy farms with foreign breeds
         * Unrelated agricultural scenes

    4. **Automatic Rejection For**:
       - General agriculture without dairy focus
       - Non-indigenous cattle breeds (Holstein, Jersey, etc.)
       - Poultry, goat, or other livestock content
       - Commercial/marketing content without educational value

    5. **Filter Application**:
       - Only proceed if \`valid: true\`
       - Match webinar content against all subfilters (ignore main filter categories)
       - Include all matching subfilters (can be multiple)
       - Be precise - only include filters that clearly match the content

    6. **Response Format**:
       - If relevant:
         {
           "valid": true,
           "filters": ["matched_subfilter1", "matched_subfilter2", ...]
         }
       - If irrelevant:
         {
           "valid": false,
           "filters": []
         }

    ### Important Rules
    - NEVER include main filter categories (TechnologyInnovation, MilkProduction etc.)
    - ONLY return subfilter values that exactly match the predefined list
    - Be strict about relevance - false positives are worse than false negatives
    - Return PURE JSON ONLY - no explanations or markdown formatting
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

    const response = await result.response;
    const responseText = response.text();
    return responseText;
  } catch (error) {
    console.error("Error validating webinar:", error);
    return null;
  }
};