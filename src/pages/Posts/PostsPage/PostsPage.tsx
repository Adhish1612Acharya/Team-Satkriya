import { useEffect, useState } from "react";
import PostCard from "@/components/Post/PostCard/PostCard";
import { PostModal } from "@/components/Post/PostModal";
import { Card, CardTitle } from "@/components/ui/card";
import Post from "@/types/posts.types";
import CreatePostForm from "@/components/Forms/Posts/CreatePostForm/CreatePostForm";
import usePost from "@/hooks/usePost/usePost";
import PostCardSkeleton from "@/components/Post/PostCardSkeleton/PostCardSkeleton";
import Filter from "@/components/Filter/Filter/Filter";
import getUserInfo from "@/utils/getUserInfo";
import { auth } from "@/firebase";
import filters from "@/constants/filters";
import WorkShop from "@/types/workShop.types";
import { useAuthContext } from "@/context/AuthContext";
import { AlertCircle, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Fab } from "@mui/material";
import CreatePostDialog from "@/components/CreatePostDialog/CreatePostDialog";
import AlertDialogBox from "@/components/AlertDialogBox/AlertDialogBox";

export function PostsPage() {
  const { userType } = useAuthContext();
  const { getAllPosts } = usePost();

  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<
    "farmer" | "doctor" | "ngo" | "volunteer" | "researchInstitution" | null
  >(null);
  const [open, setOpen] = useState<boolean>(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false);
  const [deletePostId, setDeletePostId] = useState<string>("");
  const [editForm, setEditForm] = useState<boolean>(false);
  const [editPostInfo, setEditPostInfo] = useState<Post | null>(null);

  useEffect(() => {
    async function getPosts() {
      if (!userType) {
        return;
      }
      const postData = await getAllPosts();
      setPosts(postData);
      let userInfo;
      if (auth.currentUser) {
        userInfo = await getUserInfo(
          auth.currentUser.uid,
          userType as "farmers" | "experts"
        );
        setUserRole(userInfo?.role);
      }
      setLoading(false);
    }

    getPosts();
  }, [userType]);

  const handlePostClick = (post: Post) => {
    if (post) {
      setSelectedPost(post);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  

  // const handleComment = (postId: string, comment: string) => {
  //   // In a real app, this would call an API
  //   console.log(`Commented on post ${postId}: ${comment}`);

  //   // For demo purposes, we'll update the local state
  //   const updatedPosts = posts.map((post) => {
  //     if (post.id === postId) {
  //       return {
  //         ...post,
  //         comments: [
  //           // ...post,
  //           {
  //             id: `comment-${Date.now()}`,
  //             authorId: "volunteer-123", // Assuming the current user is a volunteer
  //             authorName: "Amit Patel",
  //             authorProfilePhoto:
  //               "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
  //             content: comment,
  //             createdAt: new Date().toISOString(),
  //           },
  //         ],
  //       };
  //     }
  //     return post;
  //   });

  //   setPosts(updatedPosts);
  // };

  // const handleShare = (postId: string) => {
  //   // In a real app, this would open a share dialog
  //   console.log(`Shared post ${postId}`);
  //   alert("Share functionality would be implemented here!");
  // };

  // const handleMediaClick = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   if (post.mediaUrl) {
  //     onPostClick(post);
  //   }
  // };

  // const handleShare = (e: React.MouseEvent) => {
  //   e.stopPropagation(); // Prevent event bubbling
  //   onShare(post.id);
  // };

  // const handleSave = (e: React.MouseEvent) => {
  //   e.stopPropagation(); // Prevent event bubbling
  //   setIsSaved(!isSaved);
  // };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        {/* Filter Component for better UI/UX */}
        <div className="mb-4">
          <Filter
            setLoading={setLoading}
            setData={setPosts as unknown as (data: Post[] | WorkShop[]) => void}
            filters={filters}
            isPost={true}
          />
        </div>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Community Posts</h1>

          <Card className="mb-8 overflow-hidden">
            <CardTitle>Create Post</CardTitle>
            <CreatePostForm
              firebaseDocuemntType={userType as "farmers" | "experts"}
              post={null}
              editForm={false}
            />
          </Card>

          {/* Posts Feed */}
          <div>
            {loading ? (
              <>
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </>
            ) : !loading && posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md"
              >
                <AlertCircle
                  size={48}
                  className="text-gray-500 dark:text-gray-400"
                />
                <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                  No Posts Found
                </h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-center">
                  It looks like there are no posts available at the moment. Be
                  the first to share something useful!
                </p>
              </motion.div>
            ) : (
              posts.map((post) => (
                <PostCard
                  setAlertDialog={setAlertDialogOpen}
                  key={post.id}
                  post={post}
                  userRole={userRole}
                  handleMediaClick={handlePostClick}
                  setDeletePostId={setDeletePostId}
                  setEditPostDialogOpen={setOpen}
                  setEditForm={setEditForm}
                  setEditPost={setEditPostInfo}
                  // onComment={handleComment}
                  // onLike={handleLike}
                  // onShare={handleShare}
                  // onPostClick={handlePostClick}
                />
              ))
            )}
          </div>

          {/* Post Modal */}
          <PostModal
            post={selectedPost}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            // onLike={handleLike}
            // onComment={handleComment}
            // onShare={handleShare}
          />
        </div>

        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1,
          }}
          onClick={() => setOpen(true)}
        >
          <Plus />
        </Fab>

        <CreatePostDialog
          userType={userType as "farmers" | "experts"}
          open={open}
          setOpen={setOpen}
          editForm={editForm}
          editPost={editPostInfo}
          setEditForm={setEditForm}
          setEditPost={setEditPostInfo}
        />
        <AlertDialogBox
          title="Are you sure?"
          description="This is not irresversible"
          open={alertDialogOpen}
          setOpen={setAlertDialogOpen}
          postId={deletePostId}
          userType={userType as "farmers" | "experts"}
          setPosts={setPosts}
          setPostLoading={setLoading}
        />
      </div>
    </>
  );
}
