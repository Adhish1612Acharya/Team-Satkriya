import { Comment } from '@/pages/Profiles/index';
import Post from '@/types/posts.types';

export interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string) => void;
  onPostClick:(postId:string)=>void;
}

export interface PostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string) => void;
}

export interface CommentProps {
  comment: Comment;
}