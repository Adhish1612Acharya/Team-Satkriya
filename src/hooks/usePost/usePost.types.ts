import Post from "@/types/posts.types";
import VerifiedPostProfile from "@/types/verifiedPostProfileInfo";

export interface PostArgu {
  content: string;
  images: File[];
  videos: File[];
  documents: File[];
  filters: string[];
  verified: VerifiedPostProfile[] | null;
}

export type CreatePostType = (
  postData: PostArgu,
  firebaseDocument: "experts" | "farmers"
) => Promise<string | null>;

export type GetAllPostType = () => Promise<Post[]>;

export type GetFilteredPostType = (
  filters: string[],
  userType: string | null
) => Promise<Post[]>;

export type fetchPostByIdType = (id: string) => Promise<Post | null>;

export type GetYourPostType = () => Promise<Post[]>;
