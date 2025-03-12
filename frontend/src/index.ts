// // import the Genkit and Google AI plugin libraries
// import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
// import { genkit } from 'genkit';
// import z from "zod";

// // // Ensure environment variable is loaded
// // const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// // if (!apiKey) {
// //   throw new Error("GEMINI API key is missing. Make sure you have set it in the .env file.");
// // }

// // Configure Genkit instance
// const ai = genkit({
//   plugins: [googleAI({ apiKey:"AIzaSyARnwVi3nDdvz7WBqIoEWyZJnb7Wfc1V0I" })],
//   model: gemini15Flash, // Use the free-tier Gemini 1.5 Flash
// });



// // AI Model to Categorize Posts
// export const defineFilter = ai.definePrompt({
//   name: "Define Post Filters",
//   model: gemini15Flash, // Ensures usage of free-tier AI model
//   input: {
//     schema: z.object({
//       content: z.string(), // Post description
//       media: z.string().optional(), // Base64-encoded image/document/video
//       // mediaType: z.enum(["image", "document", "video"]).optional(), // Media type
//       existingFilters: z.record(z.array(z.string())), // Pass the existing filters from Firebase
//     }),
//   },
//   output: {
//     format: "json",
//     schema: z.object({
//       filter: z.array(z.string()), // Suggested filters from existing ones
//       newFilter: z
//         .object({
//           mainCategory: z.string(), // New main filter (if applicable)
//           subCategories: z.array(z.string()), // New subfilters under the main category
//         })
//         .nullable(), // If no new filter is required, return null
//     }),
//   },
//   prompt: `
//   You are an AI assistant specializing in content classification. Given a post's description and optional media (image, document, or video), your task is to categorize the post into one or more predefined filters. You will receive a structured list of filters from a database to ensure consistency.
  
//   ### Instructions:
  
//   #### **Match Existing Filters**:
//   - Identify relevant categories from the provided list of filters.
//   - Return only the most relevant filters that apply to the post.
  
//   #### **Suggest New Filters (if necessary)**:
//   - If no existing filter matches, create a new main filter and a sub-filter based on the post’s context.
//   - If an appropriate main filter exists but lacks a relevant sub-filter, propose a new sub-filter under it.
//   - If all filters are sufficient, return **"newFilter": null**.
  
//   #### **Ensure Accuracy**:
//   - Do **not** generate overly broad or vague filters.
//   - Prioritize **precision over quantity**—return only the most applicable filters.
//   - Consider the **context and intent** behind the post (e.g., queries, success stories, medical advice).
//     `,
// });

// // const helloFlow = ai.defineFlow('helloFlow', async (name) => {
// //   // make a generation request
// //   const { text } = await ai.generate(`Hello Gemini, my name is ${name}`);
// //   console.log(text);
// // });

// // helloFlow('Chris');