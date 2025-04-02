import {
  CreatePostType,
  deletePostType,
  EditPostType,
  fetchPostByIdType,
  GetAllPostType,
  GetFilteredPostType,
} from "./usePost.types";
import {
  addDoc,
  arrayRemove,
  // arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  // deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  QueryConstraint,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "@/firebase";
import { uploadFilesToCloudinary } from "./usePostUtility";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import getUserInfo from "@/utils/getUserInfo";
import Post from "@/types/posts.types";
import Comment from "@/types/comment.types";
import convertToBase64 from "@/utils/covertToBase64";
import { verifyAndValidateAndFilterEditedPost } from "@/utils/geminiApiCalls";
import filters from "@/constants/filters";

const usePost = () => {
  const navigate = useNavigate();

  const getYourPosts = async () => {
    try {
      const user = auth.currentUser;

      // 1. Authentication Check
      if (!user) {
        toast.warn("Please login to view your posts");
        navigate("/auth");
        return [];
      }

      // 2. Parallel Data Fetching (Posts + Likes)
      const [postsQuery, likesQuery] = await Promise.all([
        getDocs(
          query(
            collection(db, "posts"),
            where("ownerId", "==", user.uid),
            orderBy("createdAt", "desc")
          )
        ),
        getDocs(
          query(
            collection(db, "likes"),
            where("ownerId", "==", user.uid),
            orderBy("createdAt", "desc")
          )
        ),
      ]);

      // 3. Pre-process likes data for O(1) lookups
      const likedPostIds = new Set<string>();
      likesQuery.docs.forEach((doc) => {
        likedPostIds.add(doc.data().postId);
      });

      // 4. Combine Posts with Like Status
      const userPosts = postsQuery.docs.map((postDoc) => {
        const postId = postDoc.id;
        // Check if current user liked this post
        const currUserLiked = likedPostIds.has(postId);

        return {
          id: postId,
          currUserLiked,
          ...postDoc.data(),
        } as Post;
      });

      return userPosts;
    } catch (error) {
      // 5. Error Handling
      console.error("Failed to fetch user posts:", error);
      toast.error("Could not load your posts. Please try again.");
      return [];
    }
  };

  const getAllPosts: GetAllPostType = async () => {
    // Validate user authentication first
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.warn("You need to login to view posts");
      navigate("/expert/login");
      return [];
    }

    try {
      // Fetch posts and likes in parallel to improve performance
      const [postsQuery, likesQuery] = await Promise.all([
        getDocs(query(collection(db, "posts"), orderBy("createdAt", "desc"))),
        getDocs(
          query(
            collection(db, "likes"),
            where("ownerId", "==", currentUser.uid) // Only get likes by current user
          )
        ),
      ]);

      // Pre-process likes data for O(1) lookups
      const likedPostIds = new Set<string>();
      likesQuery.docs.forEach((doc) => {
        likedPostIds.add(doc.data().postId);
      });

      // Transform posts data with additional metadata
      return postsQuery.docs.map((doc) => {
        const data = doc.data();
        const postId = doc.id;

        // Check if current user liked this post
        const currUserLiked = likedPostIds.has(postId);

        // Safely extract post data with defaults
        return {
          id: postId,
          currUserLiked,
          ...data,
        } as Post;
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts. Please try again later.");
      // Consider returning an error object or throwing for better error handling
      return [];
    }
  };

  const fetchPostById: fetchPostByIdType = async (id: string) => {
    if (!auth.currentUser) {
      toast.warn("You need to login to view posts");
      return null;
    }

    try {
      // Fetch post and like status in parallel for better performance
      const [postDoc, likeQuery] = await Promise.all([
        getDoc(doc(db, "posts", id)),
        getDocs(
          query(
            collection(db, "likes"),
            where("postId", "==", id),
            where("ownerId", "==", auth.currentUser.uid)
          )
        ),
      ]);

      if (!postDoc.exists()) {
        toast.error("Post not found");
        return null;
      }

      const postData = postDoc.data();
      const currUserLiked = !likeQuery.empty;

      return {
        id: postDoc.id,
        currUserLiked,
        ...postData,
      } as Post;
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to fetch post");
      return null;
    }
  };

  const getFilteredPosts: GetFilteredPostType = async (
    filters: string[],
    userType: string | null
  ) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.warn("You need to login to view posts");
      navigate("/expert/login");
      return [];
    }

    try {
      // Base query components
      const queryConstraints: QueryConstraint[] = [
        orderBy("createdAt", "desc"),
      ];

      // Add filters based on parameters
      if (filters.length > 0) {
        queryConstraints.push(where("filters", "array-contains-any", filters));
      }

      if (userType !== null) {
        queryConstraints.push(where("role", "==", userType));
      }

      // Execute the query
      const postsQuery = await getDocs(
        query(collection(db, "posts"), ...queryConstraints)
      );

      // Get user's likes in parallel with posts query for better performance
      const [likesQuery] = await Promise.all([
        getDocs(
          query(
            collection(db, "likes"),
            where("ownerId", "==", currentUser.uid)
          )
        ),
        // Could add other parallel queries here if needed
      ]);

      // Create lookup for liked posts
      const likedPostIds = new Set<string>();
      likesQuery.docs.forEach((doc) => {
        likedPostIds.add(doc.data().postId);
      });

      // Transform and return posts
      return postsQuery.docs.map((doc) => {
        const data = doc.data();
        const postId = doc.id;
        const currUserLiked = likedPostIds.has(postId);

        return {
          id: postId,
          currUserLiked,
          ...data,
        } as Post;
      });
    } catch (error) {
      console.error("Error fetching filtered posts:", error);
      toast.error("Failed to load filtered posts");
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

  const editPost: EditPostType = async (
    postId,
    postOwnerId,
    updatedPostData,
    existingFilters
  ) => {
    try {
      // 1. Authentication & Authorization Checks
      if (!auth.currentUser) {
        toast.warn("Please login to edit posts");
        navigate("/auth");
        return;
      }

      // 2. Verify Post Existence and Ownership
      if (auth.currentUser.uid !== postOwnerId) {
        toast.error("Ownership verification failed");
        return navigate("/posts");
      }

      // 3. Initialize media arrays
      let images: string[] = [];
      let documents: string[] = [];
      let videos: string[] = [];
      let base64MediaUrl: string | null = null;
      let uploadedMedia: string | File | null =
        updatedPostData.images[0] ||
        updatedPostData.documents[0] ||
        updatedPostData.videos[0] ||
        null;

      // 4. Handle Media Conversion (if new media is uploaded)
      if (uploadedMedia && uploadedMedia instanceof File) {
        try {
          base64MediaUrl = await convertToBase64(uploadedMedia);
        } catch (error) {
          console.error("Media conversion error:", error);
          toast.error("Failed to process media file");
          return;
        }
      }

      // 5. AI Content Validation & Filtering
      let aiVerificationResponse;
      try {
        aiVerificationResponse = await verifyAndValidateAndFilterEditedPost(
          { content: updatedPostData.content, existingFilters },
          {
            base64: base64MediaUrl,
            cloudinaryUrl:
              (typeof uploadedMedia === "string" && uploadedMedia) || null,
          },
          filters
        );

        if (!aiVerificationResponse.valid) {
          toast.error("Post content doesn't meet community guidelines");
          return;
        }
      } catch (error) {
        console.error("AI validation error:", error);
        toast.error("Content validation service unavailable");
        return;
      }

      // 6. Upload New Media Files (if any)
      try {
        if (
          uploadedMedia &&
          uploadedMedia instanceof File &&
          uploadedMedia.type.startsWith("image/")
        ) {
          const imageUrls = await uploadFilesToCloudinary([uploadedMedia]);
          images = imageUrls.filter((url) => url);
        }

        if (
          uploadedMedia &&
          uploadedMedia instanceof File &&
          uploadedMedia.type.startsWith("video/")
        ) {
          const videoUrls = await uploadFilesToCloudinary([uploadedMedia]);
          videos = videoUrls.filter((url) => url);
        }

        if (
          uploadedMedia &&
          uploadedMedia instanceof File &&
          uploadedMedia.type.startsWith("application/pdf")
        ) {
          const documentUrls = await uploadFilesToCloudinary([uploadedMedia]);
          documents = documentUrls.filter((url) => url);
        }
      } catch (uploadError) {
        console.error("Media upload failed:", uploadError);
        toast.error("Failed to upload media files");
        return;
      }

      // 7. Prepare Update Data Object
      const updatedData = {
        content: updatedPostData.content.trim(),
        images: images,
        videos: videos,
        documents: documents,
        filters: aiVerificationResponse.filters,
        verified: aiVerificationResponse.verification ? [] : null,
        updatedAt: new Date(),
      };

      // 8. Database Update Operation
      try {
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, updatedData);
        toast.success("Post updated successfully");
        navigate(`/posts/${postId}`);
      } catch (dbError) {
        console.error("Database update failed:", dbError);
        toast.error("Failed to save changes");
        navigate("/posts");
      }
    } catch (error) {
      console.error("Unexpected error in editPost:", error);
      toast.error("An unexpected error occurred");
      navigate("/posts");
    }
  };

  const deletePost: deletePostType = async (
    postId,
    postOwnerId,
    firebaseDocument
  ) => {
    try {
      // 1. Authentication & Authorization Validation
      const user = auth.currentUser;

      if (!user) {
        toast.warn("Please login to delete posts");
        navigate("/auth");
        return;
      }

      if (user.uid !== postOwnerId) {
        toast.warn("Unauthorized: You can only delete your own posts");
        navigate("/posts");
        return;
      }

      // 2. Database References
      const postRef = doc(db, "posts", postId);
      const userRef = doc(db, firebaseDocument, user.uid);

      // 3. Atomic Deletion Operation
      const batch = writeBatch(db);
      batch.delete(postRef);
      batch.update(userRef, {
        posts: arrayRemove(postId),
        updatedAt: new Date(), // Maintain audit trail
      });

      await batch.commit();

      // 4. Success Handling
      toast.success("Post deleted successfully");
    } catch (error) {
      // Global error handler
      console.error("Unexpected error in deletePost:", error);
      toast.error("An unexpected error occurred");
      return;
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

  const likePost = async (
    postId: string,
    likeTimeoutRef: { current: NodeJS.Timeout | null },
    setIsLiked: React.Dispatch<React.SetStateAction<boolean>>,
    setLikesCount: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const user = auth.currentUser;

    if (!user) {
      toast.warn("You need to login");
      navigate("/expert/login");
      return;
    }

    // Clear any previous pending like action
    if (likeTimeoutRef.current) {
      clearTimeout(likeTimeoutRef.current);
      likeTimeoutRef.current = null;
    }

    // Optimistically update UI immediately
    setIsLiked((prev) => {
      const newIsLiked = !prev;
      setLikesCount((prevCount) =>
        newIsLiked ? prevCount + 1 : prevCount - 1
      );
      return newIsLiked;
    });

    // Set new timeout for the actual Firebase operation
    likeTimeoutRef.current = setTimeout(async () => {
      try {
        const likesRef = collection(db, "likes");

        // Check if user has already liked the post
        const q = query(
          likesRef,
          where("postId", "==", postId),
          where("ownerId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // User had previously liked - now removing like
          const likeDoc = querySnapshot.docs[0];
          await deleteDoc(doc(db, "likes", likeDoc.id));
          await updateDoc(doc(db, "posts", postId), {
            likesCount: increment(-1),
          });
          console.log("Likes removed");
        } else {
          // User hadn't liked - now adding like
          await addDoc(likesRef, {
            postId,
            ownerId: user.uid,
            createdAt: new Date(),
          });
          await updateDoc(doc(db, "posts", postId), {
            likesCount: increment(1),
          });
          console.log("Likes added");
        }
      } catch (error) {
        console.error("Error toggling like:", error);
        // Revert UI if Firebase operation fails
        setIsLiked((prev) => {
          const revertTo = !prev;
          setLikesCount((prevCount) =>
            revertTo ? prevCount - 1 : prevCount + 1
          );
          return revertTo;
        });
        toast.error("Failed to update like");
      }
    }, 500); // 500ms debounce delay
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

  const handleBookMarkPost = async (
    postId: string,
    userType: "farmers" | "experts"
  ) => {
    const user = auth.currentUser;

    // Edge Case 1: User not authenticated
    if (!user) {
      toast.warning("Please login to bookmark posts");
      navigate("/auth");
      return;
    }

    try {
      // Edge Case 2: Verify post exists
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        toast.error("The post no longer exists");
        return;
      }

      const userRef = doc(db, userType, user.uid);
      const userSnap = await getDoc(userRef);

      // Edge Case 3: User document doesn't exist
      if (!userSnap.exists()) {
        toast.error("User profile not found");
        return;
      }

      const currentBookmarks = userSnap.data()?.bookmarks || [];
      const isBookmarked = currentBookmarks.includes(postId);

      // Transaction-like pattern for atomic updates
      if (isBookmarked) {
        await updateDoc(userRef, {
          bookmarks: arrayRemove(postId),
          updatedAt: new Date().toISOString(),
        });
        toast.success("Removed from bookmarks");
        return;
      } else {
        // Edge Case 4: Prevent duplicate bookmarks
        await updateDoc(userRef, {
          bookmarks: arrayUnion(postId),
          updatedAt: new Date().toISOString(),
        });
        toast.success("Added to bookmarks");
        return;
      }
    } catch (error) {
      console.error("Failed to bookmark posts", error);
      toast.error("Failed to bookmark posts");
      return;
    }
  };

  const fetchBookmarkedPosts = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.warning("Please login to view bookmarks");
      return [];
    }

    try {
      // 1. Get user's bookmark IDs
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const bookmarkIds = userDoc.data()?.bookmarks || [];

      // 2. Reuse fetchPostById for each bookmark
      const postPromises = bookmarkIds.map((id: string) => fetchPostById(id));
      const posts = (await Promise.all(postPromises)).filter(Boolean);

      return posts as Post[];
    } catch (error) {
      console.error("Bookmarks error:", error);
      toast.error("Failed to load bookmarks");
      return [];
    }
  };

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
    editPost,
    deletePost,
    likePost,
    handleBookMarkPost,
    fetchBookmarkedPosts,
  };
};

export default usePost;
