import Post from "@/types/posts.types";

export interface CreatePostFormProps {
  firebaseDocuemntType: "experts" | "farmers";
  post: Post | null;
  editForm: boolean;
}
