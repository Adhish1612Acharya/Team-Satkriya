import { useEffect, useState } from "react";
import PostCard from "@/components/Post/PostCard/PostCard";
import { PostModal } from "@/components/Post/PostModal";
import Post from "@/types/posts.types";
import usePost from "@/hooks/usePost/usePost";
import PostCardSkeleton from "@/components/Post/PostCardSkeleton/PostCardSkeleton";
import getUserInfo from "@/utils/getUserInfo";
import { auth } from "@/firebase";
import { useAuthContext } from "@/context/AuthContext";
import { AlertCircle, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Fab } from "@mui/material";
import CreatePostDialog from "@/components/CreatePostDialog/CreatePostDialog";
import AlertDialogBox from "@/components/AlertDialogBox/AlertDialogBox";
import { Button } from "@/components/ui/button";

const YourPostPage = () => {
  const { userType } = useAuthContext();
  const { getYourPosts } = usePost();

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
      const postData = await getYourPosts();
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

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Your Community Posts
            </h1>
            {!loading && (
              <p className="text-gray-600 dark:text-gray-300">
                {posts.length > 0
                  ? `You've shared ${posts.length} post${
                      posts.length !== 1 ? "s" : ""
                    } with the community`
                  : "Your shared posts will appear here"}
              </p>
            )}
          </div>

          {/* Posts Feed */}
          <div>
            {loading ? (
              <>
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </>
            ) : posts.length === 0 ? (
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
                  No Posts Yet
                </h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-center">
                  You haven't shared any posts yet. Click the + button below to
                  create your first post!
                </p>
                <Button
                  onClick={() => setOpen(true)}
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Post
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Recent Activity
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your latest contributions to the community
                  </p>
                </div>

                {posts.map((post) => (
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
                  />
                ))}
              </>
            )}
          </div>
          {/* Post Modal */}
          <PostModal
            post={selectedPost}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
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
};

export default YourPostPage;
