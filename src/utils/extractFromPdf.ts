import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from "pdfjs-dist";

// @ts-ignore – temporarily ignore missing type until pdfjs includes type for this
import workerSrc from 'pdfjs-dist/build/pdf.worker?url'; // 👈 This is Vite magic

GlobalWorkerOptions.workerSrc = workerSrc;

const extractTextFromPdf = async (pdfBuffer: Uint8Array): Promise<string> => {
  try {
    const loadingTask = getDocument({ data: pdfBuffer });
    const pdfDoc: PDFDocumentProxy = await loadingTask.promise;
    let extractedText = "";

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();

      extractedText +=
        textContent.items
          .map((item: any) => item.str)
          .join(" ")
          .replace(/([^\n])\n([^\n])/g, "$1 $2") +
        "\n\n";
    }

    return extractedText.trim();
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};

export default extractTextFromPdf;
