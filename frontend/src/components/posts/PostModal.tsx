import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageCircle, 
  MoreHorizontal, 
  Share, 
  ThumbsUp, 
  X 
} from "lucide-react";
import { PostModalProps } from "@/pages/Posts/PostsPage/PostsPage.type";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PostModal({ post, isOpen, onClose, onLike, onComment, onShare }: PostModalProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likes || 0);
  const [comment, setComment] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  if (!post) return null;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    onLike(post.id);
  };

  const handleComment = () => {
    if (comment.trim()) {
      onComment(post.id, comment);
      setComment("");
    }
  };

  const handleShare = () => {
    onShare(post.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/80" />
      <DialogContent className="max-w-6xl w-[90vw] h-[90vh] p-0 overflow-hidden flex">
        {/* Media Section */}
        <div className="flex-1 bg-black flex items-center justify-center">
          {post.mediaType === 'image' ? (
            <img 
              src={post.mediaUrl} 
              alt="Post content" 
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <video 
              src={post.mediaUrl} 
              controls 
              className="max-h-full max-w-full"
              autoPlay
            />
          )}
        </div>

        {/* Comments Section */}
        <div className="w-[350px] bg-white dark:bg-gray-900 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={post.authorProfilePhoto} alt={post.authorName} />
                <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.authorName}</p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{post.authorType}</span>
                  <span className="mx-1">•</span>
                  <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSave}>
                    {isSaved ? "Unsave post" : "Save post"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>Report post</DropdownMenuItem>
                  <DropdownMenuItem>Copy link</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={18} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 border-b">
            <p className="whitespace-pre-line">{post.content}</p>
          </div>

          {/* Likes and Comments Count */}
          <div className="px-4 py-2 border-b flex items-center justify-between text-sm text-gray-500">
            {likesCount > 0 && (
              <div className="flex items-center space-x-1">
                <ThumbsUp size={14} className={isLiked ? "text-blue-500" : ""} />
                <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
              </div>
            )}
            {post.comments.length > 0 && (
              <span>{post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="px-4 py-2 border-b flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "flex items-center space-x-1",
                isLiked && "text-blue-500"
              )}
              onClick={handleLike}
            >
              <ThumbsUp size={18} className={isLiked ? "fill-blue-500" : ""} />
              <span>Like</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-1"
            >
              <MessageCircle size={18} />
              <span>Comment</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-1"
              onClick={handleShare}
            >
              <Share size={18} />
              <span>Share</span>
            </Button>
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto p-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-2 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.authorProfilePhoto} alt={comment.authorName} />
                  <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                  <p className="text-sm font-medium">{comment.authorName}</p>
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" alt="Your profile" />
                <AvatarFallback>YP</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex items-center">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 border rounded-full px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="ml-2"
                  onClick={handleComment}
                  disabled={!comment.trim()}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}