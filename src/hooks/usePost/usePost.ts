import {
  CreatePostType,
  deletePostType,
  EditPostType,
  fetchPostByIdType,
  GetAllPostType,
  GetFilteredPostType,
  VerificationData,
} from "./usePost.types";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  QueryConstraint,
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
import getMediaType from "@/utils/getFileMediaType";
import { verifyUploadedMedia } from "@/utils/verifyMedia";

const usePost = () => {
  const navigate = useNavigate();

  /**
   * Fetches authenticated user's posts with like status
   * - Parallel fetches posts + likes for efficiency
   * - Uses Set for O(1) like lookups
   * - Returns empty array on error/no posts
   */
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

  /**
   * Retrieves all posts with current user's like status
   * - Optimized with parallel fetching
   * - Returns chronologically sorted (newest first)
   * - Handles auth and errors gracefully
   */
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
      return [];
    }
  };

  /**
   * Gets single post by ID with engagement data
   * - Fetches post + like status in parallel
   * - Verifies post existence
   * - Returns null for errors/not found
   */
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

  /**
   * Retrieves posts filtered by tags/user type
   * - Dynamic query building based on filters
   * - Maintains like status tracking
   * - Returns [] for no matches/errors
   */
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

  /**
   * Creates a new post with media uploads and user metadata
   * - Handles parallel media uploads (images/videos/documents)
   * - Maintains user profile association
   * - Returns new post ID or null on failure
   */
  const createPost: CreatePostType = async (postData, firebaseDocument) => {
    // 1. Authentication Check
    if (!auth.currentUser) {
      toast.warn("You need to login");
      navigate("/expert/login");
      return null;
    }

    try {
      // 2. Fetch User Data
      const userData = await getUserInfo(
        auth.currentUser.uid,
        firebaseDocument
      );
      if (!userData) {
        toast.error("User profile not found");
        return null;
      }

      // 3. Parallel Media Uploads
      const [imageUrls, videoUrls, documentUrls] = await Promise.all([
        postData.images.length
          ? uploadFilesToCloudinary(postData.images)
          : Promise.resolve([]),
        postData.videos.length
          ? uploadFilesToCloudinary(postData.videos)
          : Promise.resolve([]),
        postData.documents.length
          ? uploadFilesToCloudinary(postData.documents)
          : Promise.resolve([]),
      ]);

      // 4. Prepare Post Content
      const contentData = {
        content: postData.content,
        images: imageUrls,
        videos: videoUrls,
        documents: documentUrls,
        filters: postData.filters,
        likesCount: 0, // Initialize counters
        commentsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: auth.currentUser.uid,
        role: userData.role,
        profileData: {
          name: userData.name,
          profilePic: userData.profileData?.profilePic || "",
        },
        // Special verification handling for certain roles
        verified: ["doctor", "researchInstitution"].includes(userData.role)
          ? null
          : postData.verified,
      };

      // 5. Create Post Document
      const newPost = await addDoc(collection(db, "posts"), contentData);

      // 6. Update User's Posts Reference
      const postRef = doc(db, firebaseDocument, auth.currentUser.uid);
      await updateDoc(postRef, {
        posts: arrayUnion(newPost.id),
        updatedAt: new Date(), // Track user document update
      });

      toast.success("Post created successfully!");
      return newPost.id;
    } catch (error) {
      console.error("Post creation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create post"
      );
      return null;
    }
  };


  /**
   * Edits an existing post with comprehensive validation and media handling
   * - Performs authentication, ownership verification, and content validation
   * - Handles media verification and uploads
   * - Updates post data atomically
   * - Provides clear user feedback throughout the process
   */
  const editPost: EditPostType = async (
    postId,
    postOwnerId,
    updatedPostData,
    existingFilters
  ) => {
    try {
      // 1. AUTHENTICATION & AUTHORIZATION ==============================
      if (!auth.currentUser) {
        toast.warn("Please login to edit posts");
        navigate("/auth");
        return;
      }

      if (auth.currentUser.uid !== postOwnerId) {
        toast.error("You can only edit your own posts");
        return navigate("/posts");
      }

      // 2. MEDIA VERIFICATION ==========================================
      let mediaVerification = false;
      const uploadedMedia = [
        updatedPostData.images[0],
        updatedPostData.documents[0],
        updatedPostData.videos[0],
      ].find((item): item is File => item instanceof File);

      if (uploadedMedia) {
        try {
          const fileType = getMediaType(uploadedMedia);
          const base64File = await convertToBase64(uploadedMedia);
          const verification = await verifyUploadedMedia(
            uploadedMedia,
            fileType,
            base64File
          );

          if (!verification.valid) return;
          mediaVerification = verification.verification ?? false;
        } catch (error) {
          console.error("Media verification failed:", error);
          toast.error("Media verification service unavailable");
          return;
        }
      }

      // 3. CONTENT VALIDATION ==========================================
      let aiVerification;
      try {
        aiVerification = await verifyAndValidateAndFilterEditedPost(
          { content: updatedPostData.content, existingFilters },
          filters
        );
        if (!aiVerification.valid) return;
      } catch (error) {
        console.error("Content validation failed:", error);
        toast.error("Content validation service unavailable");
        return;
      }

      // 4. MEDIA UPLOAD ================================================
      const mediaUploads = {
        images: [] as string[],
        videos: [] as string[],
        documents: [] as string[],
      };

      if (uploadedMedia) {
        try {
          const urls = await uploadFilesToCloudinary([uploadedMedia]);
          const type = uploadedMedia.type.split("/")[0];

          if (type === "image") mediaUploads.images = urls.filter(Boolean);
          else if (type === "video") mediaUploads.videos = urls.filter(Boolean);
          else if (uploadedMedia.type === "application/pdf") {
            mediaUploads.documents = urls.filter(Boolean);
          }
        } catch (error) {
          console.error("Media upload failed:", error);
          toast.error("Failed to upload media files");
          return;
        }
      }

      // 5. DATA PREPARATION ============================================
      const updatedData = {
        content: updatedPostData.content.trim(),
        images: mediaUploads.images.length
          ? mediaUploads.images
          : updatedPostData.images.length
          ? updatedPostData.images
          : [],
        videos: mediaUploads.videos.length
          ? mediaUploads.videos
          : updatedPostData.videos.length
          ? updatedPostData.videos
          : [],
        documents: mediaUploads.documents.length
          ? mediaUploads.documents
          : updatedPostData.documents.length
          ? updatedPostData.documents
          : [],
        filters: aiVerification.filters,
        verified: aiVerification.verification || mediaVerification ? [] : null,
        updatedAt: new Date(),
      };

      // 6. DATABASE UPDATE =============================================
      try {
        await updateDoc(doc(db, "posts", postId), updatedData);
        toast.success("Post updated successfully");
        navigate(`/posts/${postId}`);
      } catch (error) {
        console.error("Database update failed:", error);
        toast.error("Failed to save changes");
        navigate("/posts");
      }
    } catch (error) {
      console.error("Unexpected error in editPost:", error);
      toast.error("An unexpected error occurred");
      navigate("/posts");
    }
  };


/**
 * Deletes a post along with all related data (comments, likes)
 * 
 * Steps:
 * 1. Validates authentication and post ownership
 * 2. Queries for related comments and likes using the postId
 * 3. Uses batched writes for atomic deletion:
 *    - Deletes the post document
 *    - Deletes all associated comments and likes
 *    - Updates the user's post reference
 * 4. Provides user feedback and handles errors gracefully
 */
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
  
      // 3. Query related comments and likes
      const commentsQuery = query(
        collection(db, "comments"),
        where("postId", "==", postId)
      );
      const likesQuery = query(
        collection(db, "likes"),
        where("postId", "==", postId)
      );
  
      const [commentsSnap, likesSnap] = await Promise.all([
        getDocs(commentsQuery),
        getDocs(likesQuery),
      ]);
  
      // 4. Batch Deletion
      const batch = writeBatch(db);
  
      // Delete the post
      batch.delete(postRef);
  
      // Update user's post list and audit
      batch.update(userRef, {
        posts: arrayRemove(postId),
        updatedAt: new Date(),
      });
  
      // Delete associated comments
      commentsSnap.forEach((doc) => batch.delete(doc.ref));
  
      // Delete associated likes
      likesSnap.forEach((doc) => batch.delete(doc.ref));
  
      // Commit the batch
      await batch.commit();
  
      // 5. Success Notification
      toast.success("Post deleted successfully");
    } catch (error) {
      // Global error handler
      console.error("Unexpected error in deletePost:", error);
      toast.error("An unexpected error occurred");
      return;
    }
  };
  

  /**
   * Adds a comment to a post and updates the comment count
   * - Validates user authentication and post existence
   * - Creates comment with user metadata
   * - Atomically updates post's comment count
   * - Handles errors gracefully with user feedback
   */
  const addCommentPost = async (
    postId: string,
    firebaseDocument: "farmers" | "experts",
    commentData: string
  ) => {
    // 1. Authentication Check
    const user = auth.currentUser;
    if (!user) {
      toast.warn("Please login to comment");
      navigate("/auth");
      return;
    }

    try {
      // 2. Fetch Required Data
      const [userData, postSnapshot] = await Promise.all([
        getUserInfo(user.uid, firebaseDocument),
        getDoc(doc(db, "posts", postId)),
      ]);

      // 3. Validation Checks
      if (!postSnapshot.exists()) {
        throw new Error("Post not found");
      }
      if (!userData) {
        throw new Error("User profile not found");
      }

      // 4. Prepare Comment Data
      const newComment = {
        content: commentData.trim(),
        postId,
        ownerId: user.uid,
        role: userData.role,
        profileData: {
          name: userData.name,
          profilePic: userData.profileData?.profilePic || "",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 5. Atomic Operations
      const batch = writeBatch(db);
      batch.set(doc(collection(db, "comments")), newComment);
      batch.update(postSnapshot.ref, {
        commentsCount: increment(1),
        updatedAt: new Date(),
      });

      await batch.commit();
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error(
        error instanceof Error ? error.message : "Comment creation failed"
      );
    }
  };

  /**
   * Fetches all comments for a specific post
   * - Validates user authentication
   * - Retrieves comments in chronological order
   * - Returns empty array for no comments or errors
   */
  const getPostComments = async (postId: string): Promise<Comment[]> => {
    // Check if the user is authenticated
    if (!auth.currentUser) {
      toast.warn("Please login to view comments");
      navigate("/auth");
      return [];
    }

    try {
      // Build Firestore query to get all comments for a given post ID ordered by creation time
      const commentsQuery = query(
        collection(db, "comments"),
        where("postId", "==", postId),
        orderBy("createdAt", "asc")
      );

      // Execute the query
      const snapshot = await getDocs(commentsQuery);

      // Map Firestore docs to Comment objects and return
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
    } catch (error) {
      // Log error and show toast message
      console.error("Failed to fetch comments:", error);
      toast.error("Failed to load comments");
      return [];
    }
  };

  /**
   * Retrieves comments filtered by user role
   * - Authenticates user before fetching
   * - Applies role-based filtering
   * - Maintains chronological ordering
   * - Gracefully handles empty results/errors
   */
  const getFilteredComments = async (
    postId: string,
    filter: "farmer" | "doctor" | "researchInstitution" | "ngo" | "volunteer"
  ): Promise<Comment[]> => {
    // Ensure user is authenticated
    if (!auth.currentUser) {
      toast.warn("Please login to view comments");
      navigate("/auth");
      return [];
    }

    try {
      // Build Firestore query to get comments by role for a specific post
      const commentsQuery = query(
        collection(db, "comments"),
        where("postId", "==", postId), // Filter by post ID
        where("role", "==", filter), // Filter by specified role
        orderBy("createdAt", "asc") // Sort chronologically
      );

      // Execute query
      const snapshot = await getDocs(commentsQuery);

      // Convert Firestore docs to Comment objects
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
    } catch (error) {
      // Log error and show toast message
      console.error(`Failed to fetch ${filter} comments:`, error);
      toast.error("Failed to load filtered comments");
      return [];
    }
  };

  /**
   * Handles post like/unlike functionality with optimistic UI updates
   * - Manages debounced like actions to prevent rapid firing
   * - Optimistically updates UI before server confirmation
   * - Syncs with Firestore (likes collection and post counters)
   * - Provides error recovery and user feedback
   */
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

  /**
   * Verifies a post and updates verification records
   *  postId - ID of the post to verify
   * returns  Verification data if successful, false otherwise
   */
  const verifyPost = async (
    postId: string
  ): Promise<VerificationData | false> => {
    const user = auth.currentUser;

    // Check if user is authenticated
    if (!user) {
      toast.warn("Please login to verify posts");
      navigate("/expert/login");
      return false;
    }

    try {
      // Get expert user info
      const userInfo = await getUserInfo(user.uid, "experts");

      // Validate user has verification privileges
      if (
        !userInfo ||
        !["doctor", "researchInstitution"].includes(userInfo.role)
      ) {
        return false;
      }

      // Prepare verification data
      const verificationData = {
        id: user.uid,
        name: userInfo.name,
        profilePic: userInfo.profilePic || "",
        role: userInfo.role,
      };

      // Create batch for atomic updates
      const batch = writeBatch(db);

      // Update post verification
      const postRef = doc(db, "posts", postId);
      batch.update(postRef, {
        verified: arrayUnion(verificationData),
      });

      // Update expert's verification history
      const expertRef = doc(db, "experts", user.uid);
      batch.update(expertRef, {
        postsVerified: arrayUnion(postId),
      });

      // Commit both updates atomically
      await batch.commit();

      return verificationData;
    } catch (error) {
      console.error("Post verification failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Verification failed"
      );
      return false;
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
  };
};

export default usePost;
