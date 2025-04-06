const parseJsonResponse = (responseText: string): any| null => {
  try {
    // Try to clean out ```json...``` wrappers if they exist
    const cleaned = responseText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e1) {
    try {
      // Fallback: try to parse raw if there was no wrapper
      return JSON.parse(responseText.trim());
    } catch (e2) {
      console.error("Failed to parse AI response:", e2);
      return null;
    }
  }
};

export default parseJsonResponse;
