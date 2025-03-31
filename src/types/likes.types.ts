import { Timestamp } from "firebase/firestore";

interface Like {
  id: string;
  ownerId: string;
  postId: string;
  createdAt: Date | Timestamp;
}

export default Like;