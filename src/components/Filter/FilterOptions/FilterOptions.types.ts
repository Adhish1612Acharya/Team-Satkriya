export interface FilterOptionsProps {
  mainFilter: string;
  filter: {
    selectType: "single" | "double"; // The type of selection allowed
    subFilters: string[]; // List of sub-filters
  };
    selectedFilters: string[];
  setSelectedFilters: (type:any) => void;
  applyFilters:()=>Promise<void>;
  userType:string | null,
  setUserType:(userType:string | null)=>void;
}
