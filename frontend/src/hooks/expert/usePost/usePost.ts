import { useState } from "react";
import { CreatePostType, GetAllPostType, GetFilteredPostType } from "./usePost.types";
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { uploadFilesToCloudinary } from "./usePostUtility";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import getUserInfo from "@/utils/getUserInfo";

const usePost=()=>{
const navigate=useNavigate();

  const [getPostLoading,setGetPostLoading]=useState<boolean>(false);
  const [postLoading,setPostLoading]=useState<boolean>(false);
  const [editPostLoading,setEditPostLoading]=useState<boolean>(false);
  const [deletePostLoading,setDeletePostLoading]=useState<boolean>(false);

  const getYourPosts=async()=>{
    auth.onAuthStateChanged(async (user) => {
      if(user){
        try {
          setGetPostLoading(true);
          const postsRef = collection(db, "posts");
          
          const q = query(postsRef, where("ownerId", "==", user.uid));
      
          const querySnapshot = await getDocs(q);
          const filteredPosts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            postData:doc.data(),
          }));
      
          setGetPostLoading(false);
          return filteredPosts;
        } catch (error) {
          setGetPostLoading(false);
          console.error("Error fetching filtered posts:", error);
          return [];
        }
      } else {
        setGetPostLoading(false);
        console.log("User is not logged in");
        toast.warn("You need to login");
        navigate("/expert/login");
      }
    })
  }

  const getAllPosts:GetAllPostType=async ()=>{
    auth.onAuthStateChanged(async (user) => {
      if(user){
        try {
          setGetPostLoading(true);
          const querySnapshot = await getDocs(collection(db, "posts"));
          setGetPostLoading(false);
          return querySnapshot.docs.map((doc) => ({ id: doc.id, postData:doc.data() }));
        }catch(error){
          setGetPostLoading(false);
          console.error("Error updating post:", error);
          toast.error("Post Creation error");
        }
      } else {
        setGetPostLoading(false);
        console.log("User is not logged in");
        toast.warn("You need to login");
        navigate("/expert/login");
      }
    })
  }

  const getFilteredPosts:GetFilteredPostType=async (filters:string[])=>{
    auth.onAuthStateChanged(async (user) => {
      if(user){
        try {
          setGetPostLoading(true);
          const postsRef = collection(db, "posts");
          
          const q = query(postsRef, where("filters", "array-contains-any", filters));
      
          const querySnapshot = await getDocs(q);
          const filteredPosts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            postData:doc.data(),
          }));

          setGetPostLoading(false);
      
          return filteredPosts;
        } catch (error) {
          setGetPostLoading(false);
          console.error("Error fetching filtered posts:", error);
          return [];
        }
      } else {
        setGetPostLoading(false);
        console.log("User is not logged in");
        toast.warn("You need to login");
        navigate("/expert/login");
      }
    })
  }

  const createPost:CreatePostType=async (postData,firebaseDocument)=>{
    auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const userData=await getUserInfo(user.uid,firebaseDocument);
            let imageUrls:string[] = [];
            let videoUrls:string[] = [];
            let documentUrls:string[]=[];
              if(postData.images.length!==0){
                  imageUrls=await uploadFilesToCloudinary(postData.images)
              }
              if(postData.videos.length!==0){
                  videoUrls=await uploadFilesToCloudinary(postData.videos)
              }

              if(postData.documents.length!==0){
                documentUrls=await uploadFilesToCloudinary(postData.videos)
            }


              const contentData = {
                  content:postData.content,
                  images: imageUrls,
                  videos: videoUrls,
                  documents:documentUrls,
                  filters:postData.filters,
                  createdAt: new Date(),
                  updatedAt:new Date(),
                  ownerId:user.uid,
                  role:userData?.role,
                  profileData:{
                      name:userData?.name,
                      profilePic:userData?.profileData?.profilePic || "",
                  },
                };
          
               const newPost= await addDoc(collection(db, "posts"), contentData);

                const postRef = doc(db, "experts", user.uid);

                await updateDoc(postRef,{ posts: arrayUnion(newPost.id),});

          }catch (error) {
            console.error("Error updating post:", error);
            toast.error("Post Creation error");
          }
          
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
}
  

 const deletePost = async (postId: string) => {
    auth.onAuthStateChanged(async (user) => {
      if (user){
        try {
            setDeletePostLoading(true);
          const postRef = doc(db, "posts", postId);
          await deleteDoc(postRef);

          const userRef = doc(db, "experts", user.uid);
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
  postLoading,setPostLoading,editPostLoading,setEditPostLoading,deletePostLoading,setDeletePostLoading,createPost,editPost,deletePost,getAllPosts,getFilteredPosts,getPostLoading,setGetPostLoading
  ,getYourPosts
}
}

export default usePost;