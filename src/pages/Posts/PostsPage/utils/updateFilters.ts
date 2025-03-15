import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

const updateFilters = async (
  existingFilters: {
    [key: string]: { selectType: "single" | "double"; subFilters: string[] };
  },
  newFilterData: {
    [key: string]: { selectType: "single" | "double"; subFilters: string[] };
  }
) => {
  try {
    const filtersRef = doc(db, "filters", "masterFilters");
    if (existingFilters) {
      if (Object.keys(newFilterData).length > 0) {
        Object.keys(newFilterData).forEach((newMainFilter) => {
          console.log("New Main Filter:", newMainFilter);

          // Get corresponding sub-filters for this main filter
          const newSubFilters = newFilterData[newMainFilter].subFilters;

          console.log("Associated Sub-Filters:", newSubFilters);

          // Check if the main filter already exists
          if (existingFilters[newMainFilter]) {
            // Append only unique sub-filters
            existingFilters[newMainFilter] = {
              selectType: existingFilters[newMainFilter].selectType,
              subFilters: [
                ...new Set([
                  ...existingFilters[newMainFilter].subFilters,
                  ...newSubFilters,
                ]),
              ],
            };
          } else {
            // Add new main filter with sub-filters
            existingFilters[newMainFilter] = {
              selectType: newFilterData[newMainFilter].selectType,
              subFilters: newSubFilters,
            };
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
