import { Timestamp } from "@firebase/firestore";
import ProfileData from "./profile.types";

interface Comment {
    id:string;
  content: string;
  createdAt: Date | Timestamp; 
  postId: string;
  ownerId: string;
  role?: string;
  profileData: ProfileData;
}

export default Comment;
