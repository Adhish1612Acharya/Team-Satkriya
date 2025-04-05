import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FC, useState } from "react";
import AlertDialogBoxProps from "./AlertDialogBox.types";
import { Loader2, Trash2 } from "lucide-react";
import usePost from "@/hooks/usePost/usePost";
import { auth } from "@/firebase";

const AlertDialogBox: FC<AlertDialogBoxProps> = ({
  title,
  description,
  open,
  setOpen,
  postId,
  userType,
  setPosts,
  setPostLoading,
}) => {
  const { deletePost, getAllPosts, getYourPosts } = usePost();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDeletePost = async () => {
    setLoading(true);
    await deletePost(
      postId,
      auth.currentUser?.uid || "",
      userType as "farmers" | "experts"
    );
    setLoading(false);
    setOpen(false);
    setPostLoading(true);
    let posts;
    if (window.location.pathname.startsWith("/user/posts")) {
      posts = await getYourPosts();
    } else {
      posts = await getAllPosts();
    }

    setPosts(posts);
    setPostLoading(false);
  };
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            onClick={handleDeletePost}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogBox;
