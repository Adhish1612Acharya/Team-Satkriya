import Post from "@/types/posts.types";

interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
    onComment: (postId: string, comment: string) => void;
    onShare: (postId: string) => void;
    onPostClick:(postId:string)=>void;
}

export default PostCardProps;
