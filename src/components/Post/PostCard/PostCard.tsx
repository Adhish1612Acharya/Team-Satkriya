import { FC, useEffect, useRef, useState } from "react";
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
  Loader2,
  MessageCircle,
  PawPrint,
  Pencil,
  Smile,
  ThumbsUp,
  Trash,
} from "lucide-react";
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
import { useAuthContext } from "@/context/AuthContext";
import { auth } from "@/firebase";
import { toast } from "react-toastify";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Handshake, Heart, Building, Leaf } from "lucide-react";

const PostCard: FC<PostCardProps> = ({
  post,
  handleMediaClick,
  userRole,
  setAlertDialog,
  setDeletePostId,
  setEditPostDialogOpen,
  setEditForm,
  setEditPost,
}) => {
  const { userType } = useAuthContext();
  const { getPostComments, addCommentPost, getFilteredComments, likePost } =
    usePost();

  const [isLiked, setIsLiked] = useState(post.currUserLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const likeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState<boolean>(false);
  const [getCommentsLoad, setGetCommentsLoad] = useState<boolean>(true);
  const [addCommentsLoad, setAddCommentsLoad] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [postCommentsCount, setPostCommentsCount] = useState<number>(
    post.commentsCount
  );

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (likeTimeoutRef.current) {
        clearTimeout(likeTimeoutRef.current);
      }
    };
  }, []);

  const handleLike = async () => {
    await likePost(post.id, likeTimeoutRef, setIsLiked, setLikesCount);
  };

  const handleShare = async (): Promise<void> => {
    const url = `${window.location.origin}/posts/${post.id}`;
    const text = `${post.content.substring(
      0,
      100
    )}...\n\n Read full post: ${url}\n\n*Shared via Gopushti* `;

    try {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);

      // If using react-hot-toast
      toast.success("Opened WhatsApp to share!", {
        position: "bottom-center",
      });
    } catch (error) {
      toast.error("Couldn't open WhatsApp");

      // Fallback with separate button
      const shouldCopy = confirm("Want to copy the link instead?");
      if (shouldCopy) {
        try {
          await navigator.clipboard.writeText(text);
          toast.success("Copied to clipboard!", {
            position: "bottom-center",
          });
        } catch (copyError) {
          toast.error("Failed to copy", {
            position: "bottom-center",
          });
        }
      }
    }
  };

  const addCommentsFunc = async () => {
    try {
      setAddCommentsLoad(true);
      await addCommentPost(post.id, userType as "farmers" | "experts", comment);
      const postComments = await getPostComments(post.id);
      setComments(postComments);
      setAddCommentsLoad(false);
      setPostCommentsCount((prev) => prev + 1);
      setComment("");
    } catch (err) {
      console.log(err);
      toast.error("Add comment error");
    }
  };

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
              <p className="font-medium">
                {post.role === "doctor" && "Dr. "}
                {post.profileData.name}
              </p>
              {/* Header: Role and Time */}
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                <span className="flex items-center gap-1 text-gray-500 text-sm">
                  {post.role === "doctor" && (
                    <>
                      <PawPrint size={14} className="text-teal-500" />
                      Veterinary Doctor
                    </>
                  )}
                  {post.role === "ngo" && (
                    <>
                      <Handshake size={14} className="text-purple-500" />
                      NGO
                    </>
                  )}
                  {post.role === "volunteer" && (
                    <>
                      <Heart size={14} className="text-red-500" />
                      Volunteer
                    </>
                  )}
                  {post.role === "researchInstitution" && (
                    <>
                      <Building size={14} className="text-green-500" />
                      Research Institution
                    </>
                  )}
                  {post.role === "farmer" && (
                    <>
                      <Leaf size={14} className="text-brown-500" />
                      Farmer
                    </>
                  )}
                </span>
                <span className="mx-1">•</span>
                <span className="whitespace-nowrap">
                  {formatDistanceToNow(
                    post.createdAt instanceof Timestamp
                      ? post.createdAt.toDate()
                      : new Date(post.createdAt),
                    { addSuffix: true }
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-end gap-2">
            {post.verified !== null &&
              post.role !== "doctor" &&
              post.role !== "researchInstitution" && (
                <div className="w-full sm:w-auto flex justify-center sm:justify-end">
                  <VerifyPostButton
                    userRole={userRole}
                    verifiedProfiles={post.verified}
                    postId={post.id}
                  />
                </div>
              )}
            {post.ownerId === auth?.currentUser?.uid &&
              !window.location.pathname.startsWith("/posts/") && (
                <div className="flex justify-center gap-2 w-full sm:w-auto">
                  <Button
                    className="text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditPost?.(post);
                      setEditForm?.(true);
                      setEditPostDialogOpen?.(true);
                    }}
                  >
                    <Pencil className="w-4 h-4 sm:mr-1" />
                    <span className="sr-only sm:not-sr-only">Edit</span>
                  </Button>
                  <Button
                    className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDeletePostId?.(post.id);
                      setAlertDialog?.(true);
                    }}
                  >
                    <Trash className="w-4 h-4 sm:mr-1" />
                    <span className="sr-only sm:not-sr-only">Delete</span>
                  </Button>
                </div>
              )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        {post.filters && post.filters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 max-h-20 overflow-y-auto">
            {post.filters.map((filter, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs sm:text-sm"
              >
                {filter}
              </span>
            ))}
          </div>
        )}
        <div className="text-gray-700 dark:text-gray-300 text-sm mt-4 max-h-40 overflow-y-auto">
          <p className="whitespace-pre-wrap">
            {post.content.replace(/\\n/g, "\n")}
          </p>
        </div>

        <div className="mt-6 relative cursor-pointer overflow-hidden rounded-md">
          {/* Display Image */}
          {post.images.length > 0 && (
            <img
              src={post.images[0]}
              alt="Post content"
              className="w-full h-64 object-contain rounded-md hover:opacity-95 transition-opacity bg-gray-100"
              onClick={() => handleMediaClick(post)}
            />
          )}

          {/* Display Video */}
          {post.videos.length > 0 && (
            <video
              src={post.videos[0]}
              loop
              muted
              autoPlay
              controls
              className="w-full h-64 object-contain rounded-md bg-gray-100"
              preload="metadata"
              onClick={() => handleMediaClick(post)}
            />
          )}

          {/* Display PDF Document */}
          {post.documents?.length > 0 && (
            <div className="mt-2">
              <a
                href={post.documents[0]} // Link to the PDF document
                target="_blank" // Open in a new tab
                rel="noopener noreferrer" // Security best practice
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <span>View Document</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v10.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col pt-0">
        <div className="flex items-center justify-between w-full pb-3 border-b">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            {likesCount > 0 && (
              <>
                <ThumbsUp
                  size={14}
                  className={isLiked ? "text-blue-500" : ""}
                />
                <span>
                  {likesCount} {likesCount === 1 ? "like" : "likes"}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <span>
              {postCommentsCount}{" "}
              {postCommentsCount === 1 || postCommentsCount === 0
                ? "comment"
                : "comments"}
            </span>
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
            className="flex items-center space-x-1 flex-1 justify-center cursor-pointer"
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
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 flex-1 justify-center"
            onClick={handleShare}
          >
            <MessageCircle size={18} className="h-4 w-4 mr-2" />
            <span>Share</span>
          </Button>
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
            <ScrollArea className="h-[200px] mb-4 pr-4">
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
            </ScrollArea>

            <div className="flex items-start space-x-2 mt-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={post.profileData.profilePic || ""}
                  alt={`${post.profileData.name}'s profile`}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gray-200 dark:bg-gray-600 text-sm font-medium">
                  {post.profileData.name
                    ? post.profileData.name.charAt(0).toUpperCase()
                    : "?"}
                </AvatarFallback>
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
                      await addCommentsFunc();
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 cursor-pointer"
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    await addCommentsFunc();
                  }}
                  disabled={!comment.trim() || addCommentsLoad}
                >
                  {addCommentsLoad ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Post"
                  )}
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
