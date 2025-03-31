import PostCard from "@/components/Post/PostCard/PostCard";
import PostCardSkeleton from "@/components/Post/PostCardSkeleton/PostCardSkeleton";
import { PostModal } from "@/components/Post/PostModal";
import { useAuthContext } from "@/context/AuthContext";
import { auth } from "@/firebase";
import usePost from "@/hooks/usePost/usePost";
import Post from "@/types/posts.types";
import getUserInfo from "@/utils/getUserInfo";
import  { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const PostDetailPage = () => {
  const { userType } = useAuthContext();
  const { id } = useParams();
  const { fetchPostById } = usePost();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<
    "farmer" | "doctor" | "ngo" | "volunteer" | "researchInstitution" | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if(!userType) return;
        let userInfo;
        setLoading(true);
        if (auth.currentUser) {
          userInfo = await getUserInfo(
            auth.currentUser.uid,
            userType as "farmers" | "experts"
          );
          setUserRole(userInfo?.role);
        }
        if (!id) {
          toast.error("Some error occured");
          setLoading(false);
          navigate("/posts");
          return;
        }
        const postDetails = await fetchPostById(id);

        if (!postDetails) {
          setPost(null);
          navigate("/posts");
        } else {
          setPost(postDetails);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id,userType]);

  const handlePostClick = (post: Post) => {
    if (post) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Post Details</h1>
      {!loading && post?
       <PostCard
       post={post}
       handleMediaClick={handlePostClick}
       userRole={userRole}

     />: <PostCardSkeleton/>
      }

      {/* Post Modal */}
      <PostModal
        post={post}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        // onLike={handleLike}
        // onComment={handleComment}
        // onShare={handleShare}
      />
      
    </div>
  );
};

export default PostDetailPage;
