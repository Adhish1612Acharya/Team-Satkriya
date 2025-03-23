import { Timestamp } from "firebase/firestore";

interface WorkShop {
  id: string;
  title: string;
  description: string;
  dateFrom: Date | Timestamp;
  dateTo: Date | Timestamp;
  mode: "online" | "offline";
  location: string;
  link: string;
  thumbnail: string;
  owner: string;
  role: string;
  profileData: {
    name: string;
    profilePic: string;
  };
}

export default WorkShop;
