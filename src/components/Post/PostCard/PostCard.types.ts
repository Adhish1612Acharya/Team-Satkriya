import Post from "@/types/posts.types";

interface PostCardProps {
  post: Post;
  userRole:
    | "farmer"
    | "doctor"
    | "ngo"
    | "volunteer"
    | "researchInstitution"
    | null;
  handleMediaClick: (post: Post) => void;
  setAlertDialog?: (value: boolean) => void;
  setDeletePostId?: (value: string) => void;
  setEditPostDialogOpen?: (value: boolean) => void | null;
  setEditForm?: (value: boolean) => void | null;
  setEditPost?: (value: Post | null) => void;
  // onComment: (postId: string, comment: string) => void;
  // likeCount:number;
  // onLike: (postId: string) => void;
  // onShare: (postId: string) => void;
  // onPostClick:(postId:string)=>void;
}

export default PostCardProps;
