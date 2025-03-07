import { useState } from "react";
import { CreatePostType } from "./usePost.types";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { uploadImagesToCloudinary, uploadVideosToCloudinary } from "./usePostUtility";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const usePost=()=>{
const navigate=useNavigate();

  const [postLoading,setPostLoading]=useState<boolean>();
  const [editPostLoading,setEditPostLoading]=useState<boolean>();
  const [deletePostLoading,setDeletePostLoading]=useState<boolean>();

  const createPost:CreatePostType=async (postData)=>{
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            let imageUrls:string[] = [];
            let videoUrls:string[] = [];
              if(postData.images.length!==0){
                  imageUrls=await uploadImagesToCloudinary(postData.images)
              }
              if(postData.videos.length!==0){
                  videoUrls=await uploadVideosToCloudinary(postData.videos)
              }
              const contentData = {
                  title:postData.title,
                  content:postData.content,
                  images: imageUrls,
                  videos: videoUrls,
                  createdAt: new Date(),
                  ownerId:user.uid,
                  
                };
          
                await addDoc(collection(db, "posts"), contentData);
        } else {
          console.log("User is not logged in");
          toast.warn("You need to login");
          navigate("/expert/login");
        }
    })


  
  }
  return {postLoading,setPostLoading,editPostLoading,setEditPostLoading,deletePostLoading,setDeletePostLoading,createPost}
}

export default usePost;