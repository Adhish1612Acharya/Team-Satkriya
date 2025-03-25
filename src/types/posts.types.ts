import { Timestamp } from "firebase/firestore";
import ProfileData from "./profile.types";
import VerifiedPostProfile from "./verifiedPostProfileInfo";

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
  verified:VerifiedPostProfile[] | null
  createdAt: Date | Timestamp;
  updatedAt:Date | Timestamp;
  ownerId: string;
  role: string;
  profileData: ProfileData;
}

export default Post;
