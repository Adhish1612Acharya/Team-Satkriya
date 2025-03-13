import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

const fetchFilters = async () => {
  const filtersRef = doc(db, "filters", "masterFilters");
  const filtersSnap = await getDoc(filtersRef);

  return filtersSnap.exists() ? filtersSnap.data() : {}; // Return filters or empty object
};

export default fetchFilters;
