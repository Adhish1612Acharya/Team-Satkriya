import axios from "axios";

export const uploadFilesToCloudinary = async (files: File[]): Promise<string[]> => {
        const uploadPromises = files.map(async (file) => {
            const isVideo = file.type.startsWith("video/");

            console.log("Is Video : ",isVideo);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
        formData.append("folder", "GSC_DEV"); 

        const cloudinaryUrl = isVideo
        ? `${import.meta.env.VITE_CLOUDINARY_VIDEO_UPLOAD_URL}`  // Use video upload endpoint
        : `${import.meta.env.VITE_CLOUDINARY_IMAGE_UPLOAD_URL}`;

        console.log("Cloudinary URL : " , cloudinaryUrl)
    
        try {
            const response = await axios.post(
                cloudinaryUrl,
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
  
  // export const uploadVideosToCloudinary = async (videos: File[]): Promise<string[]> => {
  
  //   const uploadPromises = videos.map(async (video) => {
  //     const formData = new FormData();
  //     formData.append("file", video);
  //     formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
  
  //     try {
  //       const response = await axios.post(
  //           `${import.meta.env.VITE_CLOUDINARY_UPLOAD_URL}`,
  //             formData,
  //          );

  //       return response.data.secure_url;
  //     } catch (error) {
  //       console.error("Video upload failed:", error);
  //       return null;
  //     }
  //   });
  
  //   const uploadedUrls = await Promise.all(uploadPromises);
  //   return uploadedUrls.filter((url): url is string => url !== null);
  // };
  