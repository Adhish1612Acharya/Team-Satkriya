import { toast } from "react-toastify";
import {
  createWorkShopType,
  fetchAllWorkshopsType,
  fetchWorkshopByIdType,
  GetFilteredWorkshopType,
} from "./useWorkShop.types";
import { uploadImageToCloudinary } from "./useWorkShopUtility";
import { auth, db } from "@/firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import WorkShop from "@/types/workShop.types";

const useWorkShop = () => {
  const createWorkshop: createWorkShopType = async (
    workshopData,
    filters: string[]
  ) => {
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
        filters: filters,
        owner: auth.currentUser.uid,
        role: userData.role,
        registrations: [],
        profileData: {
          name: userData.name,
          profilePic: userData.profilePic || "",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const workShopAdded = await addDoc(collection(db, "workshops"), data);

      await updateDoc(userDocRef, {
        workshops: arrayUnion(workShopAdded.id),
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
      if (!auth.currentUser) {
        return null;
      }
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
      if (!auth.currentUser) {
        return null;
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const q = query(
        collection(db, "workshops"),
        where("dateFrom", ">=", Timestamp.fromDate(today)), // Compare with today's date
        orderBy("dateFrom", "asc") // Order by date (earliest first)
      );
      // Execute the query with error handling
      const querySnapshot = await getDocs(q).catch((error) => {
        console.error("Firestore query error:", error);
        throw error; // Re-throw to be caught by the outer try-catch
      });

      // Check if the result is empty
      if (querySnapshot.empty) {
        toast.info("No workshops available yet");
        return []; // Return empty array instead of null for easier consumption
      }

      const workshops: WorkShop[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WorkShop[];

      console.log("Workshops:", workshops);

      return workshops;
    } catch (error) {
      console.error("Error fetching workshops:", error);
      toast.error("Error fetching  workshop data");
      return null;
    }
  };

  const fetchFilteredWorkshops: GetFilteredWorkshopType = async (
    filters,
    userType
  ) => {
    if (!auth.currentUser) {
      return null;
    }
    try {
      const postsRef = collection(db, "workshops");

      let q;

      if (userType !== null && filters.length > 0) {
        q = query(
          postsRef,
          where("filters", "array-contains-any", filters),
          where("role", "==", userType)
        );
      } else if (userType === null && filters.length > 0) {
        q = query(postsRef, where("filters", "array-contains-any", filters));
      } else {
        q = query(postsRef, where("role", "==", userType));
      }
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return [];
      }

      const filteredWorkShops = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        } as WorkShop;
      });

      return filteredWorkShops;
    } catch (error) {
      console.error("Error fetching filtered posts:", error);
      return [];
    }
  };

  return {
    createWorkshop,
    fetchWorkshopById,
    fetchAllWorkshops,
    fetchFilteredWorkshops,
  };
};

export default useWorkShop;
