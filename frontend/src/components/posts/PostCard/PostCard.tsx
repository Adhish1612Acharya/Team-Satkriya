import { FC, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageCircle,
  Share,
  ThumbsUp,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PostCardProps from "./PostCard.types";

const PostCard:FC<PostCardProps>  = ({
  post,
  handleMediaClick,
  onLike,
  onComment,
  onShare,
  onPostClick,
}) => {
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  // const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

 

  return (
    <Card className="mb-6 overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage
                src={post.profileData.profilePic}
                alt={post.profileData.name}
              />
              <AvatarFallback>{post.profileData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.profileData.name}</p>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span>{post.role}</span>
                <span className="mx-1">•</span>
                <span>
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSave}>
                {isSaved ? "Unsave post" : "Save post"}
              </DropdownMenuItem>
              <DropdownMenuItem>Report post</DropdownMenuItem>
              <DropdownMenuItem>Hide post</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="mb-4 whitespace-pre-line">{post.content}</p>
        {post.images.length > 0 || post.videos.length > 0 || post.documents.length > 0 && (
          <div
            className="relative cursor-pointer overflow-hidden rounded-md"
            onClick={()=>handleMediaClick(post)}
          >
            {post.images.length>0 ? (
              <img
                src={post.images[0]}
                alt="Post content"
                className="w-full h-auto object-cover rounded-md hover:opacity-95 transition-opacity"
              />
            ) : (
              <video
                src={post.videos[0]}
                loop
                muted
                autoPlay
                style={{ objectFit: "cover" }}
                controls
                className="w-full h-auto rounded-md"
                preload="metadata"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col pt-0">
        <div className="flex items-center justify-between w-full pb-3 border-b">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            {post.likesCount > 0 && (
              <>
                <ThumbsUp
                  size={14}
                  className={isLiked ? "text-blue-500" : ""}
                />
                <span>
                  {post.likesCount} {post.likesCount === 1 ? "like" : "likes"}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            {post.commentsCount> 0 && (
              <span>
                {post.commentsCount}{" "}
                {post.commentsCount=== 1 ? "comment" : "comments"}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between w-full py-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center space-x-1 flex-1 justify-center",
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
            className="flex items-center space-x-1 flex-1 justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(!showComments);
            }}
          >
            <MessageCircle size={18} />
            <span>Comment</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 flex-1 justify-center"
            onClick={handleShare}
          >
            <Share size={18} />
            <span>Share</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center space-x-1 flex-1 justify-center",
              isSaved && "text-blue-500"
            )}
            onClick={handleSave}
          >
            <Bookmark size={18} className={isSaved ? "fill-blue-500" : ""} />
            <span>Save</span>
          </Button>
        </div>

        {showComments && (
          <div className="w-full pt-3 border-t">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-2 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={comment.authorProfilePhoto}
                    alt={comment.authorName}
                  />
                  <AvatarFallback>
                    {comment.authorName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                  <p className="text-sm font-medium">{comment.authorName}</p>
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex items-start space-x-2 mt-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  alt="Your profile"
                />
                <AvatarFallback>YP</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex items-center">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[40px] flex-1 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleComment();
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleComment();
                  }}
                  disabled={!comment.trim()}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
