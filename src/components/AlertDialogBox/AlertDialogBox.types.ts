import Post from "@/types/posts.types";

interface AlertDialogBoxProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  title: string;
  description: string;
  postId: string;
  userType: string;
  setPosts: (value: Post[]) => void;
  setPostLoading: (value: boolean) => void;
}

export default AlertDialogBoxProps;
