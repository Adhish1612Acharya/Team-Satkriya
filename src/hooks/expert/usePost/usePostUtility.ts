import axios from "axios";

export const uploadImagesToCloudinary = async (images: File[]): Promise<string[]> => {
        const uploadPromises = images.map(async (image) => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
    
        try {
            const response = await axios.post(
            `${import.meta.env.VITE_CLOUDINARY_UPLOAD_URL}`,
            formData,
            );
            return response.data.secure_url;
        } catch (error) {
            console.error("Image upload failed:", error);
            return null;
        }
        });
  
    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls.filter((url): url is string => url !== null);
  };
  
  export const uploadVideosToCloudinary = async (videos: File[]): Promise<string[]> => {
  
    const uploadPromises = videos.map(async (video) => {
      const formData = new FormData();
      formData.append("file", video);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
  
      try {
        const response = await axios.post(
            `${import.meta.env.VITE_CLOUDINARY_UPLOAD_URL}`,
              formData,
           );

        return response.data.secure_url;
      } catch (error) {
        console.error("Video upload failed:", error);
        return null;
      }
    });
  
    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls.filter((url): url is string => url !== null);
  };
  