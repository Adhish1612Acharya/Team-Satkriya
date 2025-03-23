import Post from "@/types/posts.types";

interface PostCardProps {
  post: Post;
  userRole:"farmer" | "doctor" | "ngo" | "volunteer" | "researchInstitution" | null;
  handleMediaClick: (post: Post) => void;
  // onComment: (postId: string, comment: string) => void;
  // likeCount:number;
  // onLike: (postId: string) => void;
  // onShare: (postId: string) => void;
  // onPostClick:(postId:string)=>void;
}

export default PostCardProps;
