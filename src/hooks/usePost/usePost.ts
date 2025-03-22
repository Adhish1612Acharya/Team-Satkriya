import { useState } from "react";
import {
  CreatePostType,
  GetAllPostType,
  GetFilteredPostType,
} from "./usePost.types";
import {
  addDoc,
  // arrayRemove,
  arrayUnion,
  collection,
  // deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/firebase";
import { uploadFilesToCloudinary } from "./usePostUtility";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import getUserInfo from "@/utils/getUserInfo";
import Post from "@/types/posts.types";
import Comment from "@/types/comment.types";

const usePost = () => {
  const navigate = useNavigate();

  const [getPostLoading, setGetPostLoading] = useState<boolean>(false);
  const [getFilteredPostLoading, setGetFilteredPostLoading] =
    useState<boolean>(false);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [editPostLoading, setEditPostLoading] = useState<boolean>(false);
  const [deletePostLoading, setDeletePostLoading] = useState<boolean>(false);
  const [addPostCommentLoading, setAddPostCommentLoading] =
    useState<boolean>(false);

  const getYourPosts = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          setGetPostLoading(true);
          const postsRef = collection(db, "posts");

          const q = query(postsRef, where("ownerId", "==", user.uid));

          const querySnapshot = await getDocs(q);
          const filteredPosts = querySnapshot.docs.map((doc) => {
            return {
              id: doc.id,
              postData: doc.data(),
            };
          });
          setGetPostLoading(false);
          return filteredPosts;
        } catch (error) {
          setGetPostLoading(false);
          console.error("Error fetching filtered posts:", error);
          return [];
        }
      } else {
        setGetPostLoading(false);
        toast.warn("You need to login");
        navigate("/expert/login");
      }
    });
  };

  const getAllPosts: GetAllPostType = async () => {
    if (auth.currentUser) {
      try {
        setGetPostLoading(true);
        const querySnapshot = await getDocs(collection(db, "posts"));
        setGetPostLoading(false);
        return querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "Untitled",
            content: data.content || "No content available",
            images: data.images || [],
            videos: data.videos || [],
            documents: data.documents || [],
            filters: data.filters || [],
            likesCount: data.likesCount,
            commentsCount: data.commentsCount,
            createdAt: data.createdAt?.toDate() || new Date(), // Convert Firestore Timestamp to Date
            updatedAt: data.updatedAt?.toDate() || new Date(),
            ownerId: data.ownerId || "Unknown",
            role: data.role || "guest",
            verified:data.verified,
            profileData: {
              name: data.profileData?.name || "Anonymous",
              profilePic: data.profileData?.profilePic || "",
            },
          } as Post;
        });
      } catch (error) {
        setGetPostLoading(false);
        console.error("Error updating post:", error);
        toast.error("Post Creation error");
        return [];
      }
    } else {
      setGetPostLoading(false);
      toast.warn("You need to login");
      navigate("/expert/login");

      return [];
    }
  };

  const getFilteredPosts: GetFilteredPostType = async (
    filters: string[],
    userType: string | null
  ) => {
    if (auth.currentUser) {
      try {
        setGetFilteredPostLoading(true);
        const postsRef = collection(db, "posts");

        let q;

        if (userType !== null && filters.length > 0) {
          q = query(
            postsRef,
            where("filters", "array-contains-any", filters),
            where("role", "==", userType)
          );
        } else if (userType === null && filters.length > 0) {
          q = query(postsRef, where("filters", "array-contains-any", filters));
        } else {
          q = query(postsRef, where("role", "==", userType));
        }
        const querySnapshot = await getDocs(q);

        const filteredPosts = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "Untitled",
            content: data.content || "No content available",
            images: data.images || [],
            videos: data.videos || [],
            documents: data.documents || [],
            filters: data.filters || [],
            createdAt: data.createdAt?.toDate() || new Date(), // Convert Firestore Timestamp to Date
            updatedAt: data.updatedAt?.toDate() || new Date(),
            ownerId: data.ownerId || "Unknown",
            likesCount: data.likesCount,
            commentsCount: data.commentsCount,
            role: data.role || "guest",
            verified:data.verified,
            profileData: {
              name: data.profileData?.name || "Anonymous",
              profilePic: data.profileData?.profilePic || "",
            },
          } as Post;
        });

        setGetFilteredPostLoading(false);
        return filteredPosts;
      } catch (error) {
        setGetFilteredPostLoading(false);
        console.error("Error fetching filtered posts:", error);
        return [];
      }
    } else {
      setGetFilteredPostLoading(false);
      toast.warn("You need to login");
      navigate("/expert/login");

      return [];
    }
  };

  const createPost: CreatePostType = async (postData, firebaseDocument) => {
      if (auth.currentUser) {
        try {
          const userData = await getUserInfo(auth.currentUser.uid, firebaseDocument);
          let imageUrls: string[] = [];
          let videoUrls: string[] = [];
          let documentUrls: string[] = [];
          if (postData.images.length !== 0) {
            imageUrls = await uploadFilesToCloudinary(postData.images);
          }
          if (postData.videos.length !== 0) {
            videoUrls = await uploadFilesToCloudinary(postData.videos);
          }

          if (postData.documents.length !== 0) {
            documentUrls = await uploadFilesToCloudinary(postData.videos);
          }

          const contentData = {
            content: postData.content,
            images: imageUrls,
            videos: videoUrls,
            documents: documentUrls,
            filters: postData.filters,
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            ownerId: auth.currentUser.uid,
            role: userData?.role,
            profileData: {
              name: userData?.name,
              profilePic: userData?.profileData?.profilePic || "",
            },
            verified:postData.verified
          };

          const newPost = await addDoc(collection(db, "posts"), contentData);

          const postRef = doc(db, "experts", auth.currentUser.uid);

          await updateDoc(postRef, { posts: arrayUnion(newPost.id) });
        } catch (error) {
          console.error("Error updating post:", error);
          toast.error("Post Creation error");
        }
      } else {
        toast.warn("You need to login");
        navigate("/expert/login");
      }
    
  };

  const addCommentPost = async (
    postId: string,
    firebaseDocument: "farmers" | "experts",
    commentData: string
  ) => {
    const user = auth.currentUser; // Get the currently signed-in user

    if (!user) {
      toast.warn("You need to login");
      navigate("/expert/login");
      return;
    }

    try {
      setAddPostCommentLoading(true);
      const userData = await getUserInfo(user.uid, firebaseDocument);
      const postRef = doc(db, "posts", postId);
      const postSnapshot = await getDoc(postRef);

      if (!postSnapshot.exists()) {
        throw new Error("Post not found");
      }

      const newComment = {
        content: commentData,
        createdAt: new Date(), // Using JavaScript Date
        postId: postId,
        ownerId: user.uid,
        role: userData?.role,
        profileData: {
          name: userData?.name,
          profilePic: userData?.profileData?.profilePic || "",
        },
      };

      await addDoc(collection(db, "comments"), newComment);
      await updateDoc(postRef, {
        commentsCount: Number(postSnapshot.data().commentsCount || 0) + 1,
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error("Comment Creation error");
    } finally {
      setAddPostCommentLoading(false);
    }
  };

  const getPostComments = async (postId: string) => {
    // Check if the user is authenticated
    const user = auth.currentUser;

    if (!user) {
      toast.warn("You need to login");
      navigate("/expert/login");
      return [];
    }

    try {
      const commentsRef = collection(db, "comments");
      const q = query(
        commentsRef,
        where("postId", "==", postId),
        orderBy("createdAt", "asc")
      );
      const querySnapshot = await getDocs(q);

      const comments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return comments as Comment[];
    } catch (error) {
      console.error("Error fetching comments:", error);
      return []; // Return an empty array in case of error
    }
  };

  const getFilteredComments = async (
    postId: string,
    filter: "farmer" | "doctor" | "researchInstitution" | "ngo" | "volunteer"
  ) => {
    // Check if the user is authenticated
    const user = auth.currentUser;

    if (!user) {
      toast.warn("You need to login");
      navigate("/expert/login");
      return [];
    }

    try {
      const commentsRef = collection(db, "comments");
      const q = query(
        commentsRef,
        where("postId", "==", postId),
        where("role", "==", filter),
        orderBy("createdAt", "asc")
      );
      const querySnapshot = await getDocs(q);

      const comments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return comments as Comment[];
    } catch (error) {
      console.error("Error fetching comments:", error);
      return []; // Return an empty array in case of error
    }
  };

  // const editPost = async (
  //   postId: string,
  //   updatedData: { title: string; content: string }
  // ) => {
  //   auth.onAuthStateChanged(async (user) => {
  //     if (user) {
  //       try {
  //         const postRef = doc(db, "posts", postId);
  //         const postSnapshot = await getDoc(postRef);

  //         if (!postSnapshot.exists()) {
  //           throw new Error("Post not found");
  //         }

  //         await updateDoc(postRef, {
  //           ...updatedData,
  //           updatedAt: new Date(),
  //         });

  //         toast.success("Post edited");
  //       } catch (error) {
  //         console.error("Error updating post:", error);
  //         toast.error("Post edit error");
  //       }
  //     } else {

  //       toast.warn("You need to login");
  //       navigate("/expert/login");
  //     }
  //   });
  // };

  // const deletePost = async (postId: string) => {
  //   auth.onAuthStateChanged(async (user) => {
  //     if (user) {
  //       try {
  //         setDeletePostLoading(true);
  //         const postRef = doc(db, "posts", postId);
  //         await deleteDoc(postRef);

  //         const userRef = doc(db, "experts", user.uid);
  //         await updateDoc(userRef, {
  //           posts: arrayRemove(postId), // Firebase will remove this ID from the array
  //         });

  //         toast.success("Post deleted");
  //         setDeletePostLoading(false);
  //       } catch (error) {
  //         setDeletePostLoading(false);
  //         console.error("Error updating post:", error);
  //         toast.error("Post delete error");
  //       }
  //     } else {
  //       toast.warn("You need to login");
  //       navigate("/expert/login");
  //     }
  //   });
  // };

  const verifyPost = async (postId: string) => {
    const user = auth.currentUser;

    if (!user) {
      toast.warn("You need to login");
      navigate("/expert/login");
      return false;
    }

    try {
      const userInfo = await getUserInfo(user.uid, "experts");

      const postRef = doc(db, "posts", postId);

      if (userInfo) {
        await updateDoc(postRef, {
          verified: arrayUnion({
            id: user.uid,
            name: userInfo.name,
            profilePic: userInfo.profilePic || "",
          }),
        });

        return {
          id: user.uid,
          name: userInfo.name,
          profilePic: userInfo.profilePic || "",
        };
      } else {
        return false;
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error);
      return false;
    }
  };

  return {
    postLoading,
    setPostLoading,
    editPostLoading,
    setEditPostLoading,
    deletePostLoading,
    setDeletePostLoading,
    createPost,
    // editPost,
    // deletePost,
    getAllPosts,
    getFilteredPosts,
    getPostLoading,
    setGetPostLoading,
    getFilteredPostLoading,
    setGetFilteredPostLoading,
    getYourPosts,
    addPostCommentLoading,
    setAddPostCommentLoading,
    addCommentPost,
    getPostComments,
    getFilteredComments,
    verifyPost,
  };
};

export default usePost;
