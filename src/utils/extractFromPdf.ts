import { getDocument, PDFDocumentProxy } from "pdfjs-dist";

const extractTextFromPdf = async (pdfBuffer: Buffer): Promise<string> => {
  try {
    const loadingTask = getDocument({ data: pdfBuffer });
    const pdfDoc: PDFDocumentProxy = await loadingTask.promise;
    let extractedText = "";

    // Process each page sequentially to maintain order
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();

      extractedText +=
        textContent.items
          .map((item: any) => item.str)
          .join(" ") // Words within same line
          .replace(/([^\n])\n([^\n])/g, "$1 $2") + // Fix mid-paragraph line breaks
        "\n\n"; // Separate paragraphs
    }

    return extractedText.trim();
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};

export default extractTextFromPdf;
