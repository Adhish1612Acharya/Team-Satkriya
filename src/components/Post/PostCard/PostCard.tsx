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
import { MessageCircle, ThumbsUp, Smile } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import PostCardProps from "./PostCard.types";
import Comment from "@/types/comment.types";
import usePost from "@/hooks/usePost/usePost";
import { Skeleton } from "@mui/material";
import { Timestamp } from "@firebase/firestore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VerifyPostButton from "@/components/VerifyPostButton/VerifyPostButton";

const PostCard: FC<PostCardProps> = ({
  post,
  handleMediaClick,
  userRole
  // onLike,
  // onComment,
  // onShare,
  // onPostClick,
}) => {
  const { getPostComments, addCommentPost, getFilteredComments } = usePost();

  const [comment, setComment] = useState("");
  // const [isLiked, setIsLiked] = useState(false);
  // const [likesCount, setLikesCount] = useState(post.likes);
  // const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [getCommentsLoad, setGetCommentsLoad] = useState<boolean>(true);
  const [addCommentsLoad, setAddCommentsLoad] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [postCommentsCount, setPostCommentsCount] = useState<number>(
    post.commentsCount
  );

  return (
    <Card className="mb-6   overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage
                src={post.profileData.profilePic}
                alt={post.profileData.name}
              />
              <AvatarFallback>
                {post.profileData?.name?.charAt(0)}
              </AvatarFallback>
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
          {post.verified !== null && (
            <VerifyPostButton
            userRole={userRole}
              verifiedProfiles={post.verified}
              postId={post.id}
            />
          )}

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

        <div
          className="relative cursor-pointer overflow-hidden rounded-md"
          onClick={() => handleMediaClick(post)}
        >
          {post.images.length > 0 && (
            <img
              src={post.images[0]}
              alt="Post content"
              className="w-full h-auto object-cover rounded-md hover:opacity-95 transition-opacity"
            />
          )}
          {post.videos.length > 0 && (
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
      </CardContent>
      <CardFooter className="flex flex-col pt-0">
        <div className="flex items-center justify-between w-full pb-3 border-b">
          {/* <div className="flex items-center space-x-1 text-sm text-gray-500">
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
          </div> */}
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            {post.commentsCount > 0 && (
              <span>
                {postCommentsCount}{" "}
                {postCommentsCount === 1 ? "comment" : "comments"}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between w-full py-2">
          {/* <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center space-x-1 flex-1 justify-center",
              isLiked && "text-blue-500"
            )}
            // onClick={handleLike}
          >
            <ThumbsUp size={18} className={isLiked ? "fill-blue-500" : ""} />
            <span>Like</span>
          </Button> */}
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 flex-1 justify-center"
            onClick={async (e) => {
              e.stopPropagation();
              setShowComments(!showComments);
              if (showComments === false) {
                setGetCommentsLoad(true);
                const postComments = await getPostComments(post.id);
                setComments(postComments);
                setGetCommentsLoad(false);
                setComment("");
              }
            }}
          >
            <MessageCircle size={18} />
            <span>Comment</span>
          </Button>
          {/* <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 flex-1 justify-center"
            // onClick={handleShare}
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
            // onClick={handleSave}
          >
            <Bookmark size={18} className={isSaved ? "fill-blue-500" : ""} />
            <span>Save</span>
          </Button> */}
        </div>

        {showComments && (
          <div className="w-full h-[400px] overflow-y-auto pt-3 border-t">
            <div className="mb-4">
              <Select
                onValueChange={async (
                  value:
                    | "farmer"
                    | "doctor"
                    | "researchInstitution"
                    | "ngo"
                    | "volunteer"
                    | "all"
                ) => {
                  if (value === "all") {
                    setGetCommentsLoad(true);
                    const postComments = await getPostComments(post.id);
                    setComments(postComments);
                    setGetCommentsLoad(false);
                  } else {
                    setGetCommentsLoad(true);
                    const postComments = await getFilteredComments(
                      post.id,
                      value
                    );
                    setComments(postComments);
                    setGetCommentsLoad(false);
                    setComment("");
                  }
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="farmer">Farmer</SelectItem>
                  <SelectItem value="ngo">NGO</SelectItem>
                  <SelectItem value="researchInstitution">
                    Research Institution
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {getCommentsLoad ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Skeleton className="h-8 w-8 rounded-full" />{" "}
                    {/* Avatar Skeleton */}
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-[100px]" />{" "}
                      {/* Name Skeleton */}
                      <Skeleton className="h-4 w-[200px]" />{" "}
                      {/* Content Skeleton */}
                      <Skeleton className="h-3 w-[150px]" />{" "}
                      {/* Timestamp Skeleton */}
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length > 0 ? (
              comments?.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start space-x-2 mb-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={comment.profileData.profilePic}
                      alt={comment.profileData.name}
                    />
                    <AvatarFallback>
                      {comment.profileData?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                    <p className="text-sm font-medium">
                      {comment.profileData.name}
                    </p>
                    <p className="text-sm">{comment.content}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDistanceToNow(
                        comment.createdAt instanceof Timestamp
                          ? comment.createdAt.toDate() // Convert Firebase Timestamp
                          : comment.createdAt,
                        { addSuffix: true }
                      )}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 space-y-2">
                <Smile className="h-8 w-8 text-gray-400 dark:text-gray-500" />{" "}
                {/* Icon */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            )}

            <div className="flex items-start space-x-2 mt-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  alt="Your profile"
                />
                <AvatarFallback>YP</AvatarFallback>
              </Avatar>
              <div className=" flex-1 flex items-center">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[40px] flex-1 resize-none"
                  onKeyDown={async (e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      setAddCommentsLoad(true);
                      await addCommentPost(post.id, "experts", comment);
                      const postComments = await getPostComments(post.id);
                      setComments(postComments);
                      setAddCommentsLoad(false);
                      setPostCommentsCount((prev) => prev + 1);
                      setComment("");
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={async (e) => {
                    e.stopPropagation();
                    setAddCommentsLoad(true);
                    await addCommentPost(post.id, "experts", comment);
                    const postComments = await getPostComments(post.id);
                    setComments(postComments);
                    setComment("");
                    setPostCommentsCount((prev) => prev + 1);
                    setAddCommentsLoad(false);
                  }}
                  disabled={!comment.trim() || addCommentsLoad}
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
