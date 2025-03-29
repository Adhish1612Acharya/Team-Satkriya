import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Ensure your Firebase config is correctly imported
import filters from "./constants/filters";

 const addFiltersToFirestore = async () => {

  try {
    const filterDocRef = doc(db, "filters", "masterFilters"); // Single document
    await setDoc(filterDocRef, filters);
  } catch (error) {
    console.error(" Error adding filters:", error);
  }
};

// Call this function once to add filters to Firestore
export default addFiltersToFirestore;
