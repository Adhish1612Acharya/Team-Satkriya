// import filters from "@/constants/filters";
// import { FC, useState } from "react";
// import FilterOptions from "../FilterOptions/FilterOptions";
// import { FilterIcon } from "lucide-react";
// import usePost from "@/hooks/usePost/usePost";
// import FilterProps from "./Filter.types";

// const Filter:FC<FilterProps> = ({ setPosts }) => {
//   const { getFilteredPosts } = usePost();
//   const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
//   const [userType,setUserType]=useState<string | null>(null);

//   const applyFilters = async () => {
//     console.log(selectedFilters);
//     if (selectedFilters.length > 0 || userType !==null) {
//      const postData= await getFilteredPosts(selectedFilters,userType);
//      console.log("Applied Filters : ",postData);
//     setPosts(postData)
//     }
//   };

//   return (
//     <nav className="bg-white shadow-lg">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center">
//             <FilterIcon className="h-6 w-6 text-indigo-600" />
//             <span className="ml-2 text-xl font-semibold text-gray-900">
//               Cattle Community
//             </span>
//           </div>
//           <div className="flex items-center space-x-4">
//             {Object.keys(filters).length > 0 &&
//               Object.keys(filters).map((mainFilter: string) => (
//                 <FilterOptions
//                   key={mainFilter}
//                   mainFilter={mainFilter}
//                   filter={filters[mainFilter]} // Pass the filter object
//                   selectedFilters={selectedFilters}
//                   setSelectedFilters={setSelectedFilters}
//                   applyFilters={applyFilters}
//                   userType={userType}
//                   setUserType={setUserType}
//                 />
//               ))}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Filter;

import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import filters from "@/constants/filters";
import FilterProps from "./Filter.types";
import usePost from "@/hooks/usePost/usePost";

const Filter: FC<FilterProps> = ({ setPosts }) => {
  const { getFilteredPosts } = usePost();

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [activeCategory, setActiveCategory] = useState<string>(
    Object.keys(filters)[0]
  );

  const handleFilterSelect = (category: string, filter: string) => {
    setSelectedFilters((prev) => {
      const currentFilters = prev[category] || [];
      const filterCategory = filters[category];

      if (filterCategory.selectType === "single") {
        return { ...prev, [category]: [filter] };
      }

      if (currentFilters.includes(filter)) {
        return {
          ...prev,
          [category]: currentFilters.filter((f) => f !== filter),
        };
      }
      return {
        ...prev,
        [category]: [...currentFilters, filter],
      };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({});
  };

  const applyFilters = async () => {
    let appliedFilters: string[] = [];

    console.log("Slected Filters", selectedFilters);

    Object.keys(selectedFilters).map((filter) => {
      if (filter !== "UserType") {
        appliedFilters.push(...selectedFilters[filter]);
      }
    });

    appliedFilters = [...new Set(appliedFilters)];

    console.log("Final applied filters : ", appliedFilters);

    let userTypeSelected = selectedFilters["UserType"];

    console.log("User Type Selected : ", userTypeSelected);

    if (appliedFilters.length > 0 || userTypeSelected !== null) {
      const postData = await getFilteredPosts(
        appliedFilters,
        userTypeSelected?.[0].toLowerCase() || null
      );
      console.log("Applied Filters : ", postData);
      setPosts(postData);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Filter</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex gap-0 p-0 overflow-hidden">
        <div className="w-1/3 border-r">
          <DialogHeader className="p-4">
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(80vh-130px)]">
            <div className="flex flex-col">
              {Object.keys(filters).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "p-4 text-left bg-gray-100 hover:bg-white text-inherit transition-colors",
                    activeCategory === category && "bg-accent"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="w-2/3">
          <DialogHeader className="p-4 flex flex-row justify-between items-center">
            <DialogTitle>{activeCategory}</DialogTitle>
            <Button
              variant="ghost"
              onClick={() => clearFilters()}
              className="bg-gray-100 hover:bg-white text-inherit transition-colors"
            >
              Clear
            </Button>
          </DialogHeader>
          <ScrollArea className="h-[calc(80vh-130px)]">
            <div className="p-4 grid grid-cols-2 gap-2">
              {filters[activeCategory].subFilters.map((filter) => {
                const isMultiple =
                  filters[activeCategory].selectType === "double";

                return (
                  <label
                    key={filter}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type={isMultiple ? "checkbox" : "radio"}
                      name={activeCategory}
                      value={filter}
                      checked={
                        isMultiple
                          ? selectedFilters[activeCategory]?.includes(filter)
                          : selectedFilters[activeCategory]?.[0] === filter
                      }
                      onChange={() =>
                        handleFilterSelect(activeCategory, filter)
                      }
                      className={cn(
                        "appearance-none w-4 h-4 border rounded-full checked:bg-gray-100 checked:border-black",
                        !isMultiple && "checked:ring-2 checked:ring-blue-500",
                        isMultiple &&
                          "checked:bg-blue-500 checked:ring-2 checked:ring-gray-300"
                      )}
                    />
                    <span className="text-inherit">{filter}</span>
                  </label>
                );
              })}
            </div>
          </ScrollArea>
          <Separator />
          <div className="p-4 flex justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Filter;
