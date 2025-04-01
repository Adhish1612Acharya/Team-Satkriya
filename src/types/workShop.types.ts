import { Timestamp } from "firebase/firestore";

export interface Registration {
  id: string;
  name: string;
  contactNo: number;
  role: "farmer" | "doctor" | "volunteer" | "ngo" | "researchInstitution";
}

interface WorkShop {
  id: string;
  title: string;
  description: string;
  dateFrom: Date | Timestamp;
  dateTo: Date | Timestamp;
  mode: "online" | "offline";
  location: string | null;
  link: string | null;
  filters: string[];
  thumbnail: string;
  owner: string;
  role: string;
  timeFrom: string;
  timeTo: string;
  registrations: Registration[];
  currUserRegistered:boolean;
  profileData: {
    name: string;
    profilePic: string;
  };
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export default WorkShop;
