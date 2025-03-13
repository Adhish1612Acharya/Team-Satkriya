import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

const updateFilters = async (
    existingFilters: { [key: string]: string[] },
    newFilterData: { [key: string]: string[] }
  ) => {
    try {
      const filtersRef = doc(db, "filters", "masterFilters");
      if (existingFilters) {
        if (Object.keys(newFilterData).length > 0) {
          Object.keys(newFilterData).forEach((newMainFilter) => {
            console.log("New Main Filter:", newMainFilter);

            // Get corresponding sub-filters for this main filter
            const newSubFilters = newFilterData[newMainFilter];

            console.log("Associated Sub-Filters:", newSubFilters);

            // Check if the main filter already exists
            if (existingFilters[newMainFilter]) {
              // Append only unique sub-filters
              existingFilters[newMainFilter] = [
                ...new Set([
                  ...existingFilters[newMainFilter],
                  ...newSubFilters,
                ]),
              ];
            } else {
              // Add new main filter with sub-filters
              existingFilters[newMainFilter] = newSubFilters;
            }
          });

          // Update Firestore document
          await updateDoc(filtersRef, existingFilters);
        }
      }
    } catch (error) {
      console.error("Error updating filters:", error);
    }
  };

  export default updateFilters;