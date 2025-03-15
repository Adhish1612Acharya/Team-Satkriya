import ProfileData from "./profile.types";

interface Post {
  id: string;
  title: string;
  content: string;
  images: string[];
  videos: string[];
  documents: string[];
  filters: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  role: string;
  profileData: ProfileData;
}

export default Post;
