import { toast } from "react-toastify";
import {
  createWorkShopType,
  fetchAllWorkshopsType,
  fetchWorkshopByIdType,
} from "./useWorkShop.types";
import { uploadImageToCloudinary } from "./useWorkShopUtility";
import { auth, db } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import WorkShop from "@/types/workShop.types";

const useWorkShop = () => {
  const createWorkshop: createWorkShopType = async (workshopData) => {
    try {
      if (!auth.currentUser) {
        return null;
      }

      const uploadedImageUrl = await uploadImageToCloudinary(
        workshopData.thumbnail
      );

      if (!uploadedImageUrl) {
        toast.error("Image upload failed");
        return null;
      }

      const userDocRef = doc(db, "experts", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        toast.error("User not found");
        return null;
      }

      const userData = userDocSnap.data();

      const data = {
        title: workshopData.title,
        description: workshopData.description,
        dateFrom: new Date(workshopData.dateFrom),
        dateTo: new Date(workshopData.dateTo),
        timeTo: workshopData.timeTo,
        timeFrom: workshopData.timeFrom,
        mode: workshopData.mode,
        location:
          workshopData.mode === "offline" ? workshopData.location : null,
        link: workshopData.mode === "online" ? workshopData.link : null,
        thumbnail: uploadedImageUrl,
        owner: auth.currentUser.uid,
        role: userData.role,
        registrations: [],
        profileData: {
          name: userData.name,
          profilePic: userData.profilePic || "",
        },
      };
      const workShopAdded = await addDoc(collection(db, "workshops"), {
        data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return workShopAdded.id;
    } catch (err) {
      console.log(err);
      toast.error("Create wrokshop error");
      return null;
    }
  };

  const fetchWorkshopById: fetchWorkshopByIdType = async (id) => {
    try {
      const docRef = doc(db, "workshops", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error("Workshop not found!");
        toast.error("Workshop not found");
        return null;
      }

      return { id: docSnap.id, ...docSnap.data() } as WorkShop;
    } catch (error) {
      console.error("Error fetching workshop:", error);
      toast.error("Failed to fetch workshop");
      return null;
    }
  };

  const fetchAllWorkshops: fetchAllWorkshopsType = async () => {
    try {
      const q = query(
        collection(db, "workshops"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      const workshops: WorkShop[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WorkShop[];

      return workshops;
    } catch (error) {
      console.error("Error fetching workshops:", error);
      toast.error("Error fetching  workshop data");
      return null;
    }
  };

  return {
    createWorkshop,
    fetchWorkshopById,
    fetchAllWorkshops,
  };
};

export default useWorkShop;
