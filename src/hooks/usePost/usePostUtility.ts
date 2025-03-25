import axios from "axios";

export const uploadFilesToCloudinary = async (
  files: File[]
): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    const isVideo = file.type.startsWith("video/");
    const isDocument = file.type === "application/pdf";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
    formData.append("folder", "GSC_DEV");

    const cloudinaryUrl = isVideo
      ? `${import.meta.env.VITE_CLOUDINARY_VIDEO_UPLOAD_URL}` // Use video upload endpoint
      : isDocument
      ? `${import.meta.env.VITE_CLOUDINARY_DOCUMENT_UPLOAD_URL}`
      : `${import.meta.env.VITE_CLOUDINARY_IMAGE_UPLOAD_URL}`;

      console.log("Cloudinary url : ",cloudinaryUrl);

    try {
      const response = await axios.post(cloudinaryUrl, formData);
      console.log("Cloudonary repaonse : ", response);
      return response.data.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  });

  const uploadedUrls = await Promise.all(uploadPromises);
  return uploadedUrls.filter((url): url is string => url !== null);
};
