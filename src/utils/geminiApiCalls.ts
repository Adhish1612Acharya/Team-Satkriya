import Post from "@/types/posts.types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import parseJsonResponse from "./parseJsonReponse";
import { toast } from "react-toastify";

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
    // Flatten all valid subfilters for reference
    const validSubfilters = Object.values(existingFilters).flatMap(
      (category: any) => category.subFilters
    );

    const prompt = `
    You are an AI assistant specializing in content classification.  
    Your task is to categorize a given post into one or more **predefined filters**.

      STRICT RULES FOR RESPONSE:
    1. Respond ONLY with valid JSON in this exact format:
    {
      "valid": boolean,
      "filters": string[] (ONLY from allowed list),
      "error"?: string (if invalid)
    }
    2. filters MUST ONLY contain values from this exact list:
    ${JSON.stringify(validSubfilters)}
    
    ### **Input Data**
    - Post Description: "${content}"
    - Media (image, document, or video): "${media}" 
    - Available Filters: ${JSON.stringify(validSubfilters)}
    
    ### **Task Requirements**
    1. **Select Only from Existing Filters**:  
       - The response **must include at least one filter** from the predefined filters.
       - **Do not create or suggest new filters.**
       - Match the post content **only** to the most relevant existing sub-filters.
    
    2. **Strictly Return Valid JSON**:  
       - The response must be a **pure JSON object** with no markdown, explanations, or extra formatting.  
       - The JSON output **must be parsable** without backticks or surrounding text.
    
    ### **Expected JSON Response Format**
    {
      "filters": ["At least one relevant existing sub-filter"]
    }

     FILTER MATCHING RULES:
    1. Select ALL matching subfilters from the allowed list
    2. Must be EXACT matches (no variations)
    4. NEVER invent new filters
    
    - The **"filters" array must never be empty**.
    - **Only return predefined sub-filters**—do not generate new ones.
    - Ensure accuracy—**false positives are worse than false negatives**.
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
    const prompt = `
    You are an AI assistant specializing in agriculture and indigenous cow farming. Your task is to find the most relevant existing posts and webinars based on a farmer’s query.

   ### **Input Data**
    - **Farmer's Query**: "${query}"
    - **Uploaded Media (if any)**: "${media}" 
    - **Existing Posts**: ${JSON.stringify(existingPosts)}
    - **Available Webinars & Workshops**: ${JSON.stringify(
      webinarsAndWorkShopsData
    )}

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
  webinarDetails: { title: string; description: string },
  webinarFilters: any
): Promise<{ valid: boolean; filters: string[] }> => {
  try {
    // Flatten all valid subfilters for reference
    const validSubfilters = Object.values(webinarFilters).flatMap(
      (category: any) => category.subFilters
    );
    const prompt = `
    You are an AI assistant specializing in indigenous cow dairy farming. Your task is to:
    1. Validate if a webinar is relevant to indigenous cow dairy farming
    2. If relevant, apply predefined filters to categorize the webinar

     STRICT RULES FOR RESPONSE:
    1. Respond ONLY with valid JSON in this exact format:
    {
      "valid": boolean,
      "filters": string[] (ONLY from allowed list),
      "error"?: string (if invalid)
    }
    2. filters MUST ONLY contain values from this exact list:
    ${JSON.stringify(validSubfilters)}

    ### Input Data
    - Webinar Details: ${JSON.stringify(webinarDetails)}
    - Predefined Filters: ${JSON.stringify(validSubfilters)}

    ### Task Instructions
    1. **Relevance Validation**:
       - Analyze the webinar title, description
       - The content must specifically relate to dairy farming through indigenous cows
       - Specific mention of indigenous/desi cow breeds (Gir, Sahiwal, Red Sindhi, etc.)
       - Focus on dairy farming aspects (milk production, breeding, health management ,etc )
       - Traditional or sustainable dairy practices
       - Return \`valid: false\` if:
         * Content is about general agriculture without dairy focus
         * Focuses on non-indigenous cattle breeds
         * Contains irrelevant commercial content
  

    2. **Automatic Rejection For**:
       - General agriculture without dairy focus
       - Non-indigenous cattle breeds (Holstein, Jersey, etc.)
       - Poultry, goat, or other livestock content
       - Commercial/marketing content without educational value

     3. SPECIAL CASES:
   - General cow health content ONLY valid if applicable to all breeds
   - Must pass both title AND description check


    4. **Filter Application**:
       - Only proceed if \`valid: true\`
       - Match webinar content against all subfilters (ignore main filter categories)
       - Include all matching subfilters (can be multiple)
       - Be precise - only include filters that clearly match the content

    5. **Response Format**:
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
    - ONLY return subfilter values that exactly  match the predefined list
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

    const responseText = result.response.text();
    const parsed = parseJsonResponse(responseText);

    const valid = parsed?.valid === "true" || parsed?.valid === true;

    if (!valid) {
      toast.error("Invalid wrokshop content");
    }
    return {
      valid: valid,
      filters: parsed.filters,
    };
  } catch (error) {
    console.error("Error validating webinar:", error);
    return {
      valid: false,
      filters: [],
    };
  }
};

type PostValidationResponse = {
  valid: boolean;
  verify: boolean;
};

export const validateAndVerifyPost = async (postDetails: {
  content: string;
}): Promise<PostValidationResponse> => {
  try {
    const prompt = `
    You are an AI assistant specializing in dairy farming using indigenous cows. Your task is to:
    1. Validate if a post is relevant to indigenous cow dairy farming.
    2. Determine if the post requires verification from a veterinary doctor or research institution.

    ### Input Data:
    - Post Details: ${JSON.stringify(postDetails)}

    ### Task Instructions:

    #### **1. Relevance Validation**
    - Analyze the post description,
    - The content must specifically relate to **dairy farming using indigenous cows**.
    - Must include **desi breeds** (Gir, Sahiwal, Red Sindhi, Tharparkar, etc.).
    - Content should focus on **dairy farming**, such as:
      - Indigenous cow care, health, and breeding
      - Milk production, nutrition, and feeding
      - Sustainable and traditional farming practices
    - **Automatic Rejection For**:
      - General agriculture without dairy focus
      - Non-indigenous cattle breeds (Holstein, Jersey, etc.)
      - Poultry, goat farming, or other livestock topics
      - Commercial or promotional content without educational value

    #### **3. Verification Requirement**
    - If **valid**, determine whether the content requires expert verification:
      ✅ **Requires Verification** (verify: "true") if:
        - Scientific facts about indigenous cows
        - Health care routines and disease management
        - Breeding techniques or veterinary recommendations
        - Research-backed information on milk production and nutrition
      ❌ **Does NOT Require Verification** (verify: "false") if:
        - A farmer is **asking a query** or seeking advice
        - A webinar or event is being **promoted** 
        - General discussions on indigenous cow benefits

    ### **Response Format**
    - If relevant content:
      {
        "valid": "true",
        "verify": "true" or "false"
      }
    - If irrelevant content:
      {
        "valid": "false",
        "verify": "null"
      }

    ### **Important Rules**
    - STRICTLY return JSON **only** (no extra text, markdown, or explanations).
    - Maintain high accuracy - **false positives are worse than false negatives**.
    - Consider all provided content (text) before making a decision.
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
    const responseText = result.response.text();
    const parsed = parseJsonResponse(responseText);

    const valid =
      (parsed && (parsed.valid === "true" || parsed.valid === true)) || false;
    const verify =
      (parsed && (parsed.verify === "true" || parsed.verify === true)) || false;

    if (!parsed || !valid) {
      toast.error("Post is not relevant to indigenous dairy farming.");
      return {
        valid: false,
        verify: false,
      };
    }

    return {
      valid: valid,
      verify: verify,
    };
  } catch (error) {
    console.error("Error validating post:", error);
    toast.error("Failed to validate post due to an internal error.");
    return {
      valid: false,
      verify: false,
    };
  }
};

export const verifyAndValidateAndFilterEditedPost = async (
  postDetails: { content: string; existingFilters: string[] },
  predefinedFilters: any // Pass the filters object you provided
): Promise<{
  valid: true | false;
  verification: true | false;
  filters: string[];
}> => {
  try {
    const prompt = `
    You are an AI assistant specializing in dairy farming using indigenous cows. Your task is to:
    1. Validate if an edited post is relevant to indigenous cow dairy farming
    2. Determine if it requires expert verification
    3. Assign appropriate filters from predefined categories while preserving relevant existing filters

    ### Input Data:
    - Post Content: ${JSON.stringify(postDetails.content)}
    - Existing Filters: ${JSON.stringify(postDetails.existingFilters)}

    ### Task Instructions:

    #### 1. Relevance Validation (STRICT)
    - Content must specifically relate to dairy farming using indigenous cows (Gir, Sahiwal, Red Sindhi, Tharparkar)
    - Automatic rejection for:
      * Non-dairy topics
      * Foreign breeds (Jersey, Holstein)
      * Other livestock (poultry, goats)
      * Commercial/promotional content

    #### 2. Verification Check (if valid)
    ✅ Requires verification ("true") for:
      - Scientific/medical claims
      - Disease treatments
      - Breeding techniques
      - Research-backed nutrition advice
    ❌ No verification ("false") for:
      - Farmer queries
      - Event announcements
      - General discussions

    #### 3. Filter Assignment (if valid)
    - Analyze content to match with THESE SPECIFIC FILTER CATEGORIES ONLY:
      ${predefinedFilters}
    - PRESERVE existing filters that still match the edited content
    - ONLY include sub-filters from the predefined list
    - NEVER include UserType filters
    - For SuccessStoryType, only include specific achievement filters

    ### Response Format:
    - If INVALID:
    {
      "valid": "false",
      "verification": "false",
      "filters": []
    }

    - If VALID:
    {
      "valid": "true",
      "verification": "true"|"false",
      "filters": ["sub-filter1", "sub-filter2"] // Existing+new matching filters
    }

    ### Rules:
    - STRICTLY return valid JSON (no markdown/text)
    - Filter names must EXACTLY match predefined subFilters
    - False positives are worse than false negatives
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const responseText = result.response.text();
    const parsed = parseJsonResponse(responseText);

    const valid =
      (parsed && (parsed.valid === "true" || parsed.valid === true)) || false;
    const verify =
      (parsed &&
        (parsed.verification === "true" || parsed.verification === true)) ||
      false;

    if (!parsed || !valid) {
      toast.error("Post is not relevant to indigenous dairy farming.");
      return { valid: false, verification: false, filters: [] };
    }

    // Validate filters against predefined list
    const validSubFilters = Object.values(predefinedFilters).flatMap(
      (category: any) => category.subFilters
    );

    const filteredFilters = parsed.filters.filter((f: string) =>
      validSubFilters.includes(f)
    );

    return {
      valid: valid,
      verification: verify,
      filters: Array.from(new Set(filteredFilters)), // Remove duplicates
    };
  } catch (error) {
    console.error("Validation error:", error);
    return { valid: false, verification: false, filters: [] };
  }
};

export const verifyIndigenousDairyImage = async (
  imageBase64: string
): Promise<boolean> => {
  try {
    const base64Data = imageBase64.split(",")[1]; // Remove data URI prefix

    const prompt = `
You are an AI media validator specialized in indigenous dairy farming. Strictly analyze the provided image and return JSON response.

### Validation Criteria:
### Detailed Validation Rules:

1. VALID if image contains ANY of these:
   - Recognizable indigenous cow breeds (Gir, Sahiwal, Red Sindhi, Tharparkar , etc)
   - Dairy activities with desi cows (milking, feeding, grazing , etc)
   - Cattle sheds/farms with indigenous breeds
   - Educational content about indigenous dairy farming
   - Health/management practices applicable to all cows but shown with desi breeds

2. INVALID if image contains ANY of these:
   - Non-indigenous breeds (Jersey, Holstein ,etc .) as primary focus
   - Other livestock (buffalo, goats,etc) as main subject
   - Crop farming without dairy connection
   - Pure commercial ads without educational value
   - General agriculture not specific to dairy

3. SPECIAL CASES:
   - Accept general cow health content if could apply to indigenous breeds
   - Accept text/images mentioning "indigenous" or "desi" cows
   - Reject if breed is unidentifiable and no dairy context

2. Automatic rejection for:
   - Non-indigenous breeds (Jersey, Holstein, etc.)
   - Other livestock (goats, poultry, buffalo , etc)
   - Crop farming or irrelevant agriculture
   - Commercial/promotional content
    - General agriculture without dairy focus
    - Non-indigenous cattle breeds (Holstein, Jersey, etc.)
    - Poultry, goat farming, or other livestock topics
    - Commercial or promotional content without educational value

### Response Format:
{ "valid": boolean }
`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/jpeg",
              },
            },
            { text: prompt },
          ],
        },
      ],
    });

    const responseText = result.response.text();
    const parsed = parseJsonResponse(responseText);

    const valid = parsed?.valid === "true" || parsed?.valid === true;
    if (valid) {
      return true;
    } else {
      toast.error(
        "Image does not meet indigenous dairy verification criteria."
      );
      return false;
    }
  } catch (error) {
    console.error("Error verifying image:", error);
    toast.error("Verification failed due to an internal error.");
    return false;
  }
};

interface VerificationResult {
  isRelevant: boolean;
  requiresVerification: boolean;
}

/**
 * Verifies PDF content with Gemini AI for indigenous dairy farming relevance
 * @param {string} textContent - Extracted PDF text
 * @returns {Promise<VerificationResult>} Verification results
 */
export const verifyPDFWithGemini = async (
  textContent: string
): Promise<VerificationResult> => {
  const prompt = `
Analyze this document for indigenous dairy farming relevance:

**Indigenous Breeds**: Gir, Sahiwal, Red Sindhi, Tharparkar, Kankrej

**Rules**:
1. RELEVANT if:
   - Mentions specific breeds
   - Discusses dairy farming practices
   - Covers health/nutrition of indigenous cows
2. REQUIRES VERIFICATION if:
   - Contains medical/scientific claims
   - Recommends treatments/breeding techniques
   - Makes nutritional assertions

**Document Content**:
${textContent.substring(0, 30000)}

**Respond EXACTLY in this JSON format**:
{
  "isRelevant": boolean,
  "requiresVerification": boolean,
}
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const parsed = parseJsonResponse(responseText);

    const isRelevant =
      parsed?.isRelevant === "true" || parsed?.isRelevant === true;
    const requiresVerification =
      parsed?.requiresVerification === "true" ||
      parsed?.requiresVerification === true;

    if (parsed) {
      if (!isRelevant) {
        toast.error("PDF is not relevant to indigenous dairy farming.");
        return {
          isRelevant: false,
          requiresVerification: false,
        };
      }
      return {
        isRelevant: true,
        requiresVerification: requiresVerification,
      };
    } else {
      toast.error("Unable to analyze PDF content. Please try again.");
      return {
        isRelevant: false,
        requiresVerification: false,
      };
    }
  } catch (error) {
    console.error("Gemini verification error:", error);
    toast.error("Failed to verify PDF due to an internal error.");
    return {
      isRelevant: false,
      requiresVerification: false,
    };
  }
};

export interface VideoVerificationResult {
  valid: boolean;
  requiresVerification: boolean;
}

/**
 * Verifies if the uploaded video shows indigenous dairy farming
 * Allows fallback post if billing fails (demo mode)
 */
export const verifyIndigenousDairyVideo = async (
  videoBase64: string
): Promise<VideoVerificationResult> => {
  const base64Data = videoBase64.split(",")[1];

  const prompt = `
You are an AI media validator specialized in indigenous dairy farming. Analyze the provided video and return a JSON object to determine:

### Evaluation Criteria:

1. **Valid Content**:
   - Shows indigenous cow breeds (Gir, Sahiwal, Red Sindhi, Tharparkar, etc.)
   - Depicts dairy farming practices (milking, feeding, cattle sheds)
   - Highlights traditional/sustainable farming methods

2. **Invalid Content**:
   - Features non-indigenous breeds (Jersey, Holstein, etc.)
   - Includes other livestock (goats, poultry, buffalo)
   - Irrelevant topics like crop farming or promotional content

3. **Requires Expert Verification** if:
   - Scientific, medical, nutritional, or breeding claims are made
   - Advice is given on diet, health, treatment, or reproduction

### Response Format (strictly JSON):
{
  "valid": boolean,
  "requiresVerification": boolean
}
`;

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: "video/mp4",
              },
            },
            { text: prompt },
          ],
        },
      ],
    });

    const responseText = result.response.text();
    const parsed = parseJsonResponse(responseText);

    const valid = parsed?.valid === "true" || parsed?.valid === true;
    const requiresVerification =
      parsed?.requiresVerification === "true" ||
      parsed?.requiresVerification === true;

    if (parsed) {
      if (!valid) {
        toast.error("Video is not valid for indigenous dairy farming.");
        return {
          valid: false,
          requiresVerification: false,
        };
      }
      return {
        valid: true,
        requiresVerification: requiresVerification,
      };
    } else {
      toast.error(
        "Unable to analyze video content. For demo purposes, the video will still be posted."
      );
      return {
        valid: true,
        requiresVerification: true,
      };
    }
  } catch (error: any) {
    console.error("Video verification error:", error);
    const message = error?.message || "";
    if (message.includes("insufficient_quota") || message.includes("billing")) {
      toast.error(
        "Billing issue: Gemini quota exceeded. Video will still be posted for demo purposes."
      );
    } else {
      toast.error("Verification failed. Posting the video for demo purposes.");
    }
    return {
      valid: true,
      requiresVerification: true,
    };
  }
};
