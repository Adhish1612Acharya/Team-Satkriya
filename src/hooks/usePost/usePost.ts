import {
  CreatePostType,
  fetchPostByIdType,
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
  serverTimestamp,
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

  const getYourPosts = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const postsRef = collection(db, "posts");

          const q = query(
            postsRef,
            where("ownerId", "==", user.uid),
            orderBy("createdAt", "desc")
          );

          const querySnapshot = await getDocs(q);
          const filteredPosts = querySnapshot.docs.map((doc) => {
            return {
              id: doc.id,
              postData: doc.data(),
            };
          });

          return filteredPosts;
        } catch (error) {
          console.error("Error fetching filtered posts:", error);
          return [];
        }
      } else {
        toast.warn("You need to login");
        navigate("/expert/login");
      }
    });
  };

  const getAllPosts: GetAllPostType = async () => {
    if (auth.currentUser) {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

        const querySnapshot = await getDocs(q);

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
            verified: data.verified,
            profileData: {
              name: data.profileData?.name || "Anonymous",
              profilePic: data.profileData?.profilePic || "",
            },
          } as Post;
        });
      } catch (error) {
        console.error("Error updating post:", error);
        toast.error("Post Creation error");
        return [];
      }
    } else {
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
        const postsRef = collection(db, "posts");

        let q;

        if (userType !== null && filters.length > 0) {
          q = query(
            postsRef,
            where("filters", "array-contains-any", filters),
            where("role", "==", userType),
            orderBy("createdAt", "desc")
          );
        } else if (userType === null && filters.length > 0) {
          q = query(
            postsRef,
            where("filters", "array-contains-any", filters),
            orderBy("createdAt", "desc")
          );
        } else {
          q = query(
            postsRef,
            where("role", "==", userType),
            orderBy("createdAt", "desc")
          );
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
            verified: data.verified,
            profileData: {
              name: data.profileData?.name || "Anonymous",
              profilePic: data.profileData?.profilePic || "",
            },
          } as Post;
        });

        return filteredPosts;
      } catch (error) {
        console.error("Error fetching filtered posts:", error);
        return [];
      }
    } else {
      toast.warn("You need to login");
      navigate("/expert/login");

      return [];
    }
  };

  const createPost: CreatePostType = async (postData, firebaseDocument) => {
    if (auth.currentUser) {
      try {
        const userData = await getUserInfo(
          auth.currentUser.uid,
          firebaseDocument
        );
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
          documentUrls = await uploadFilesToCloudinary(postData.documents);
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
          verified:
            userData?.role === "doctor" ||
            userData?.role === "researchInstitution"
              ? null
              : postData.verified,
        };

        const newPost = await addDoc(collection(db, "posts"), contentData);

        const postRef = doc(db, firebaseDocument, auth.currentUser.uid);

        await updateDoc(postRef, { posts: arrayUnion(newPost.id) });
        return newPost.id;
      } catch (error: any) {
        console.error("Error updating post:", error);
        toast.error("Post creation error");
        return null;
      }
    } else {
      toast.warn("You need to login");
      navigate("/expert/login");
      return null;
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
      const userData = await getUserInfo(user.uid, firebaseDocument);
      const postRef = doc(db, "posts", postId);
      const postSnapshot = await getDoc(postRef);

      if (!postSnapshot.exists()) {
        throw new Error("Post not found");
      }

      const newComment = {
        content: commentData,
        postId: postId,
        ownerId: user.uid,
        role: userData?.role,
        profileData: {
          name: userData?.name,
          profilePic: userData?.profileData?.profilePic || "",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addDoc(collection(db, "comments"), newComment);

      const currentCommentsCount = postSnapshot.exists()
        ? Number(postSnapshot.data()?.commentsCount || 0)
        : 0;

      await updateDoc(postRef, {
        commentsCount: currentCommentsCount + 1,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error("Comment Creation error");
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

      console.log("Comments : ", comments);

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

  const fetchPostById: fetchPostByIdType = async (id) => {
    try {
      if (!auth.currentUser) {
        return null;
      }
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error("Post not found!");
        toast.error("Post not found");
        return null;
      }

      return { id: docSnap.id, ...docSnap.data() } as Post;
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to fetch post");
      return null;
    }
  };

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

  return {
    createPost,
    getAllPosts,
    getFilteredPosts,
    getYourPosts,
    addCommentPost,
    getPostComments,
    getFilteredComments,
    verifyPost,
    fetchPostById,
    // editPost,
    // deletePost,
  };
};

export default usePost;
