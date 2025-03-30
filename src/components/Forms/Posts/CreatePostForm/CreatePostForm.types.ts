import Post from "@/types/posts.types";

export interface CreatePostFormProps {
  firebaseDocuemntType: "experts" | "farmers";
  post?: Post;
  editForm?: boolean;
}
