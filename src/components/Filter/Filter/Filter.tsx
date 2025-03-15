import filters from "@/constants/filters";
import { FC, useState } from "react";
import FilterOptions from "../FilterOptions/FilterOptions";
import { FilterIcon } from "lucide-react";
import usePost from "@/hooks/usePost/usePost";
import FilterProps from "./Filter.types";

const Filter:FC<FilterProps> = ({ setPosts }) => {
  const { getFilteredPosts } = usePost();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [userType,setUserType]=useState<string | null>(null);

  const applyFilters = async () => {
    console.log(selectedFilters);
    if (selectedFilters.length > 0 || userType !==null) {
     const postData= await getFilteredPosts(selectedFilters,userType);
     console.log("Applied Filters : ",postData);
    setPosts(postData)
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <FilterIcon className="h-6 w-6 text-indigo-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              Cattle Community
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {Object.keys(filters).length > 0 &&
              Object.keys(filters).map((mainFilter: string) => (
                <FilterOptions
                  key={mainFilter}
                  mainFilter={mainFilter}
                  filter={filters[mainFilter]} // Pass the filter object
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  applyFilters={applyFilters}
                  userType={userType}
                  setUserType={setUserType}
                />
              ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Filter;
