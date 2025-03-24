import axios from "axios";

export const uploadImageToCloudinary = async (
  file: File
): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
  formData.append("folder", "GSC_DEV");

  const cloudinaryUrl = `${import.meta.env.VITE_CLOUDINARY_IMAGE_UPLOAD_URL}`;

  try {
    const response = await axios.post(cloudinaryUrl, formData);
    console.log("Cloudonary repaonse : ", response);
    return response.data.secure_url;
  } catch (error) {
    console.error("Image upload failed:", error);
    return null;
  }
};
