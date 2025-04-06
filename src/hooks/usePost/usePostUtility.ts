import axios from "axios";

/**
 * Uploads multiple files (image, video, or PDF) to Cloudinary
 *
 * - Automatically chooses correct upload endpoint based on file type
 * - Supports images, videos, and documents (PDF)
 * - Returns array of secure URLs for successfully uploaded files
 * - Skips and filters out any failed uploads (returns only valid URLs)
 */
export const uploadFilesToCloudinary = async (
  files: File[]
): Promise<string[]> => {
  // Map each file to its upload promise
  const uploadPromises = files.map(async (file) => {
    // Detect file type
    const isVideo = file.type.startsWith("video/");
    const isDocument = file.type === "application/pdf";

    // Prepare form data for Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
    formData.append("folder", "GSC_DEV");

    // Dynamically choose correct Cloudinary endpoint
    const cloudinaryUrl = isVideo
      ? `${import.meta.env.VITE_CLOUDINARY_VIDEO_UPLOAD_URL}` // Video upload endpoint
      : isDocument
      ? `${import.meta.env.VITE_CLOUDINARY_DOCUMENT_UPLOAD_URL}` // PDF/document endpoint
      : `${import.meta.env.VITE_CLOUDINARY_IMAGE_UPLOAD_URL}`; // Default to image upload

    try {
      // Perform the upload via POST request
      const response = await axios.post(cloudinaryUrl, formData);
      return response.data.secure_url; // Return Cloudinary secure URL
    } catch (error) {
      console.error("Image upload failed:", error);
      return null; // In case of error, return null (will be filtered later)
    }
  });

  // Wait for all uploads to complete
  const uploadedUrls = await Promise.all(uploadPromises);

  // Filter out any failed uploads (null entries)
  return uploadedUrls.filter((url): url is string => url !== null);
};
