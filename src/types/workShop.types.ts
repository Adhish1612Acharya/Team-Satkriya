import { Timestamp } from "firebase/firestore";

interface WorkShop {
  id: string;
  title: string;
  description: string;
  dateFrom: Date | Timestamp;
  dateTo: Date | Timestamp;
  mode: "online" | "offline";
  location: string | null;
  link: string | null;
  thumbnail: string;
  owner: string;
  role: string;
  timeFrom:string;
  timeTo:string;
  profileData: {
    name: string;
    profilePic: string;
  };
}

export default WorkShop;
