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
  writeBatch,
} from "firebase/firestore";
import WorkShop from "@/types/workShop.types";
import { useNavigate } from "react-router-dom";

const useWorkShop = () => {
  const navigate = useNavigate();

  const getAllYourWorkshops = async (): Promise<WorkShop[] | null> => {
    try {
      // Check authentication
      const user = auth.currentUser;
      if (!user) {
        toast.warn("Please login to view your workshops");
        return null;
      }

      // Create query for workshops owned by current user
      const workshopsQuery = query(
        collection(db, "workshops"),
        where("owner", "==", user.uid), // Changed from "ownerId" to match your createWorkshop field
        orderBy("createdAt", "desc") // Added sorting by creation date
      );

      // Execute query
      const querySnapshot = await getDocs(workshopsQuery);

      // Transform documents into Workshop objects
      const workshops = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as WorkShop)
      );

      return workshops;
    } catch (error) {
      console.error("Error fetching workshops:", error);
      toast.error("Failed to load your workshops");
      return null;
    }
  };

  const createWorkshop: createWorkShopType = async (workshopData, filters) => {
    // Early exit if unauthenticated
    const user = auth.currentUser;
    if (!user) {
      toast.warn("Authentication required");
      return null;
    }

    try {
      // Parallelize independent operations
      const [uploadedImageUrl, userDocSnap] = await Promise.all([
        uploadImageToCloudinary(workshopData.thumbnail),
        getDoc(doc(db, "experts", user.uid)),
      ]);

      // Validate prerequisites
      if (!uploadedImageUrl) {
        toast.error("Image upload failed");
        return null;
      }
      if (!userDocSnap.exists()) {
        toast.error("Expert profile missing");
        return null;
      }

      // Prepare data with atomic writes
      const batch = writeBatch(db);
      const workshopRef = doc(collection(db, "workshops"));

      const workshopDoc = {
        title: workshopData.title.trim(),
        description: workshopData.description.trim(),
        dateFrom: new Date(workshopData.dateFrom),
        dateTo: new Date(workshopData.dateTo),
        timeFrom: workshopData.timeFrom,
        timeTo: workshopData.timeTo,
        mode: workshopData.mode,
        location:
          workshopData.mode === "offline"
            ? workshopData.location?.trim()
            : null,
        link: workshopData.mode === "online" ? workshopData.link?.trim() : null,
        thumbnail: uploadedImageUrl,
        filters,
        owner: user.uid,
        role: userDocSnap.data().role,
        registrations: [],
        profileData: {
          name: userDocSnap.data().name.trim(),
          profilePic: userDocSnap.data().profilePic || "",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Atomic write operations
      batch.set(workshopRef, workshopDoc);
      batch.update(doc(db, "experts", user.uid), {
        workshops: arrayUnion(workshopRef.id),
      });

      await batch.commit();
      toast.success("Workshop created!");
      return workshopRef.id;
    } catch (error) {
      console.error("Workshop creation failed:", error);
      toast.error(error instanceof Error ? error.message : "Creation error");
      return null;
    }
  };

  const fetchWorkshopById: fetchWorkshopByIdType = async (id: string) => {
    try {
      // 1. Authentication Check
      const user = auth.currentUser;
      if (!user) {
        toast.warn("Please login to view workshop details");
        return null;
      }

      // 2. Document Reference
      const workshopRef = doc(db, "workshops", id);
      const workshopSnap = await getDoc(workshopRef);

      // 3. Existence Check
      if (!workshopSnap.exists()) {
        toast.error("Workshop not found");
        return null;
      }

      // 4. Data Processing
      const workshopData = workshopSnap.data();

      // 5. Return Typed Workshop Object
      return {
        id: workshopSnap.id,
        ...workshopData,
      } as WorkShop;
    } catch (error) {
      // 6. Error Handling
      console.error(`Failed to fetch workshop ${id}:`, error);
      toast.error("Error loading workshop details");
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

  const getWorkshopRegistrationDetails: GetWorkshopRegistrationDetailsType =
    async (workshopId) => {
      try {
        // Validate current user
        const user = auth.currentUser;
        if (!user) {
          toast.error("Authentication required to view registrations");
          navigate("/auth");
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

          // Verify user is the workshop owner
          if (user.uid !== workshopDoc.data().ownerId) {
            toast.warn("Only the workshop owner can view registration details");
            navigate("/workshops");
            return;
          }

        // Type-safe extraction of workshop data
        const workshopData = {
          id: workshopDoc.id,
          ...workshopDoc.data(),
        } as WorkShop;

        // Return registration details if they exist, otherwise empty array
        return workshopData;
      } catch (error) {
        console.error("Failed to fetch registration details:", error);
        toast.error("Error loading registration information");
        return; // Return empty array on failure
      }
    };

  return {
    createWorkshop,
    fetchWorkshopById,
    fetchAllWorkshops,
    fetchFilteredWorkshops,
    registerWorkShop,
    getWorkshopRegistrationDetails,
    getAllYourWorkshops,
  };
};

export default useWorkShop;
