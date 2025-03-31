import { toast } from "react-toastify";
import {
  createWorkShopType,
  fetchAllWorkshopsType,
  fetchWorkshopByIdType,
  GetFilteredWorkshopType,
  GetWorkshopRegistrationDetailsType,
  RegisterWorkshopType,
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
import { useNavigate } from "react-router-dom";

const useWorkShop = () => {
  const navigate = useNavigate();

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

  const registerWorkShop: RegisterWorkshopType = async (
    workshopId,
    userType
  ) => {
    try {
      // Validate current user
      const user = auth.currentUser;
      if (!user) {
        toast.error("You must login to register for workshops");
        navigate("/auth");
        return;
      }

      // Get user document reference and snapshot
      const userDocRef = doc(db, userType, user.uid);
      const userDocSnap = await getDoc(userDocRef);

      // Verify user exists
      if (!userDocSnap.exists()) {
        toast.error("User account not found");
        return;
      }

      const userData = userDocSnap.data();

      // Prepare registration data
      const registrationData = {
        id: user.uid,
        name: userData.name,
        contactNo: userData.contactNo,
        role: userData.role,
      };

      // Get workshop document reference
      const workshopDocRef = doc(db, "workshops", workshopId);

      // Execute both updates in parallel for better performance
      await Promise.all([
        // Add user to workshop registrations
        updateDoc(workshopDocRef, {
          registrations: arrayUnion(registrationData),
        }),

        // Add workshop to user's registrations
        updateDoc(userDocRef, {
          registrations: arrayUnion(workshopId),
        }),
      ]);

      toast.success("Successfully registered for the workshop!");
    } catch (error) {
      console.error("Workshop registration failed:", error);
      toast.error("Failed to register for workshop");
    }
  };


  const getWorkshopRegistrationDetails:GetWorkshopRegistrationDetailsType = async (
    workshopId,
    ownerId
  ) => {
    try {
      // Validate current user
      const user = auth.currentUser;
      if (!user) {
        toast.error("Authentication required to view registrations");
        navigate("/auth");
        return;
      }

      // Verify user is the workshop owner
      if (user.uid !== ownerId) {
        toast.warn("Only the workshop owner can view registration details");
        navigate("/workshops");
        return;
      }

      // Get workshop document
      const workshopDoc = await getDoc(doc(db, "workshops", workshopId));

      // Verify workshop exists
      if (!workshopDoc.exists()) {
        toast.warn("The requested workshop does not exist");
        navigate("/workshops");
        return;
      }

      // Type-safe extraction of workshop data
      const workshopData = {
        id: workshopDoc.id,
        ...workshopDoc.data(),
      } as WorkShop;

      // Return registration details if they exist, otherwise empty array
      return workshopData.registrations || [];
    } catch (error) {
      console.error("Failed to fetch registration details:", error);
      toast.error("Error loading registration information");
      return []; // Return empty array on failure
    }
  };

  return {
    createWorkshop,
    fetchWorkshopById,
    fetchAllWorkshops,
    fetchFilteredWorkshops,
    registerWorkShop,
    getWorkshopRegistrationDetails,
  };
};

export default useWorkShop;
