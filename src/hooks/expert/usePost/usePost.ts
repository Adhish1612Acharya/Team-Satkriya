import { useState } from "react";
import { CreatePostType } from "./usePost.types";
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { uploadImagesToCloudinary, uploadVideosToCloudinary } from "./usePostUtility";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import getUserInfo from "@/utils/getUserInfo";

const usePost=()=>{
const navigate=useNavigate();

  const [postLoading,setPostLoading]=useState<boolean>();
  const [editPostLoading,setEditPostLoading]=useState<boolean>();
  const [deletePostLoading,setDeletePostLoading]=useState<boolean>();


  const getPosts=async ()=>{
    try {
  }

  const createPost:CreatePostType=async (postData)=>{
    auth.onAuthStateChanged(async (user) => {
        if (user) {
          const userData=await getUserInfo(user.uid,"expert");
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
                  filters:[],
                  createdAt: new Date(),
                  updatedAt:new Date(),
                  ownerId:user.uid,
                  role:postData.role,
                  profileData:{
                      name:userData?.name,
                      profilePic:userData?.profileData?.profilePic,
                  },
                };
          
               const newPost= await addDoc(collection(db, "posts"), contentData);

                const postRef = doc(db, "expert", user.uid);

                await updateDoc(postRef,{ posts: arrayUnion(newPost.id),});
        } else {
          console.log("User is not logged in");
          toast.warn("You need to login");
          navigate("/expert/login");
        }
    })
  }

const editPost = async (postId: string, updatedData: {title:string,content:string}) => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        const postRef = doc(db, "posts", postId);
        const postSnapshot = await getDoc(postRef);
        
        if (!postSnapshot.exists()) {
          throw new Error("Post not found");
        }
    
        await updateDoc(postRef, {
          ...updatedData,
          updatedAt: new Date(),
        });
    
        
        toast.success("Post edited");
      } catch (error) {
        console.error("Error updating post:", error);
        toast.error("Post edit error");
      }
    }
    else{
      console.log("User is not logged in");
      toast.warn("You need to login");
      navigate("/expert/login");
    }
  });

 const deletePost = async (postId: string) => {
    auth.onAuthStateChanged(async (user) => {
      if (user){
        try {
            setDeletePostLoading(true);
          const postRef = doc(db, "posts", postId);
          await deleteDoc(postRef);

          const userRef = doc(db, "expert", user.uid);
          await updateDoc(userRef, {
            posts: arrayRemove(postId), // Firebase will remove this ID from the array
          });
    
          toast.success("Post deleted");
          setDeletePostLoading(false);
        } catch (error) {
          setDeletePostLoading(false);
          console.error("Error updating post:", error);
          toast.error("Post delete error");
        }
      }
      else{
        console.log("User is not logged in");
        toast.warn("You need to login");
        navigate("/expert/login");
      }
    });
 };
   
  return {
    postLoading,setPostLoading,editPostLoading,setEditPostLoading,deletePostLoading,setDeletePostLoading,createPost,editPost,deletePost
  }
}
}

export default usePost;