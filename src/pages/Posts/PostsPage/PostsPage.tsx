import { useEffect, useState } from "react";
import PostCard from "@/components/Post/PostCard/PostCard";
import { PostModal } from "@/components/Post/PostModal";
import { Card } from "@/components/ui/card";
import Post from "@/types/posts.types";
import CreatePostForm from "@/components/Forms/Posts/CreatePostForm/CreatePostForm";
import usePost from "@/hooks/usePost/usePost";
import PostCardSkeleton from "@/components/Post/PostCardSkeleton/PostCardSkeleton";
import Filter from "@/components/Filter/Filter/Filter";
import getUserInfo from "@/utils/getUserInfo";
// import { useAuthContext } from "@/context/AuthContext";
import { auth } from "@/firebase";

export function PostsPage() {
  const { getAllPosts, getPostLoading, getFilteredPostLoading } = usePost();

  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<
    "farmer" | "doctor" | "ngo" | "volunteer" | "researchInstitution" | null
  >(null);

  useEffect(() => {
    async function getPosts() {
      const postData = await getAllPosts();
      setPosts(postData);
      let userInfo;
      if (auth.currentUser) {
        userInfo = await getUserInfo(
          auth.currentUser.uid,
          localStorage.getItem("userType") as "farmers" | "experts"
        );
        console.log("UserInfo; ", userInfo);
        setUserRole(userInfo?.role);
      }
    }

    getPosts();
  }, []);

  const handleLike = (postId: string) => {
    // In a real app, this would call an API
    console.log(`Liked post ${postId}`);
  };

  const handleComment = (postId: string, comment: string) => {
    // In a real app, this would call an API
    console.log(`Commented on post ${postId}: ${comment}`);

    // For demo purposes, we'll update the local state
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            // ...post,
            {
              id: `comment-${Date.now()}`,
              authorId: "volunteer-123", // Assuming the current user is a volunteer
              authorName: "Amit Patel",
              authorProfilePhoto:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
              content: comment,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      }
      return post;
    });

    setPosts(updatedPosts);
  };

  const handleShare = (postId: string) => {
    // In a real app, this would open a share dialog
    console.log(`Shared post ${postId}`);
    alert("Share functionality would be implemented here!");
  };

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
      <Filter setPosts={setPosts} />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Community Posts</h1>

          <Card className="mb-8 overflow-hidden">
            <CreatePostForm firebaseDocuemntType={"experts"} />
          </Card>

          {/* Posts Feed */}
          <div>
            {getPostLoading || getFilteredPostLoading ? (
              <>
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onComment={handleComment}
                  userRole={userRole}
                  handleMediaClick={handlePostClick}
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
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
          />
        </div>
      </div>
    </>
  );
}
