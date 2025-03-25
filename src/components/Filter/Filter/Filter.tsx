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
import FilterProps from "./Filter.types";
import usePost from "@/hooks/usePost/usePost";
import useWorkShop from "@/hooks/useWorkShop/useWorkShop";

const Filter: FC<FilterProps> = ({ setData, filters, isPost, setLoading }) => {
  const { getFilteredPosts, getAllPosts } = usePost();
  const { fetchFilteredWorkshops, fetchAllWorkshops } = useWorkShop();

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [activeCategory, setActiveCategory] = useState<string>(
    Object.keys(filters)[0]
  );
  const [isOpen, setIsOpen] = useState(false); // State to control dialog visibility

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

  const clearFilters = async () => {
    setSelectedFilters({});
    setIsOpen(false);
    let responseData;
    if (isPost) {
      setLoading(true);
      responseData = await getAllPosts();
    } else {
      responseData = await fetchAllWorkshops();
    }
    if (responseData) {
      setData(responseData);
    }
    setLoading(false);
  };

  const applyFilters = async () => {
    setLoading(true);
    setIsOpen(false);
    let appliedFilters: string[] = [];

    Object.keys(selectedFilters).map((filter) => {
      if (filter !== "UserType") {
        appliedFilters.push(...selectedFilters[filter]);
      }
    });

    appliedFilters = [...new Set(appliedFilters)];

    let userTypeSelected = selectedFilters["UserType"];
    

    if (appliedFilters.length > 0 || userTypeSelected !== null) {
      let responseData;
      if (isPost) {
        responseData = await getFilteredPosts(
          appliedFilters,
          userTypeSelected?.[0].toLowerCase() || null
        );
      } else {
        responseData = await fetchFilteredWorkshops(
          appliedFilters,
          userTypeSelected?.[0].toLowerCase() || null
        );
      }
      console.log("Reponse Data : ", responseData);
      if (responseData) {
        setData(responseData);
      }
    }

    // Close the dialog after applying filters

    setLoading(false);
  };

  const getSelectedCount = (category: string) => {
    return selectedFilters[category]?.length || 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Filter{" "}
          {Object.values(selectedFilters).flat().length > 0 &&
            `(${Object.values(selectedFilters).flat().length})`}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col md:flex-row gap-0 p-0 overflow-hidden transition-all duration-200 ease-in-out">
        <div className="w-full md:w-1/3 border-r">
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
                    "p-4 text-left bg-gray-100 hover:bg-white text-inherit transition-colors flex justify-between items-center border-b border-gray-200",
                    activeCategory === category && "bg-accent"
                  )}
                >
                  <span>{category}</span>
                  {getSelectedCount(category) > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {getSelectedCount(category)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="w-full md:w-2/3">
          <DialogHeader className="p-4">
            <DialogTitle>{activeCategory}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(80vh-180px)]">
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filters[activeCategory].subFilters.map((filter: any) => {
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
                        "appearance-none w-4 h-4 border rounded-full checked:bg-gray-100 checked:border-black transition-all duration-200 ease-in-out",
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
          <div className="p-4 flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                clearFilters();
              }}
              className="bg-gray-100 hover:bg-white text-inherit transition-colors duration-200 ease-in-out"
            >
              Clear
            </Button>
            <Button
              onClick={applyFilters}
              className="transition-colors duration-200 ease-in-out cursor-pointer"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Filter;
