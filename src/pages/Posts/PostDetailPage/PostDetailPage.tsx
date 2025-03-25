import PostCard from "@/components/Post/PostCard/PostCard";
import usePost from "@/hooks/usePost/usePost";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const PostDetailPage = () => {
  const { id } = useParams();
  const { fetchPostById } = usePost();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
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
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Post Details</h1>
      <PostCard post={post} />
    </div>
  );
};

export default PostDetailPage;
