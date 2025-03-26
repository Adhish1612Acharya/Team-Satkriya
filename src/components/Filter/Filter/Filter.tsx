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
import { ChevronDown, ChevronUp, X } from "lucide-react";

const Filter: FC<FilterProps> = ({ setData, filters, isPost, setLoading }) => {
  const { getFilteredPosts, getAllPosts } = usePost();
  const { fetchFilteredWorkshops, fetchAllWorkshops } = useWorkShop();

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [activeCategory, setActiveCategory] = useState<string>(
    Object.keys(filters)[0]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(Object.keys(filters).reduce((acc, key) => ({ ...acc, [key]: false }), {}));

  // Auto-close other dropdowns when one is opened
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newState = { ...prev };
      // Close all other categories
      Object.keys(newState).forEach((key) => {
        newState[key] = key === category ? !newState[key] : false;
      });
      return newState;
    });
  };

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

  const totalSelected = Object.values(selectedFilters).flat().length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full cursor-pointer py-3 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg"
        >
          Filter
          {totalSelected > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalSelected}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[85vh] sm:h-[80vh] w-[95vw] sm:w-full flex flex-col p-0 overflow-hidden">
        {/* Mobile View */}
        <div className="md:hidden flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
            <DialogTitle className="text-lg">Filters</DialogTitle>
            <div className="flex items-center space-x-2">
              {totalSelected > 0 && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {totalSelected} selected
                </span>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Selected UserType Indicator */}
          {selectedFilters["UserType"]?.length > 0 && (
            <div className="px-4 pt-2">
              <div className="bg-blue-50 text-blue-800 text-sm px-3 py-2 rounded-md flex items-center">
                <span className="font-medium mr-2">User Type:</span>
                <span>{selectedFilters["UserType"][0]}</span>
                <button
                  onClick={() => {
                    setSelectedFilters((prev) => {
                      const newFilters = { ...prev };
                      delete newFilters["UserType"];
                      return newFilters;
                    });
                  }}
                  className="ml-auto text-blue-600 hover:text-blue-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 py-2">
            <div className="space-y-2 pb-4">
              {Object.keys(filters).map((category) => (
                <div
                  key={category}
                  className="border rounded-lg overflow-hidden bg-white shadow-sm"
                  ref={(el) => {
                    if (el && expandedCategories[category]) {
                      setTimeout(() => {
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                        });
                      }, 100);
                    }
                  }}
                >
                  <button
                    onClick={() => toggleCategory(category)}
                    className={cn(
                      "w-full p-4 text-left flex justify-between items-center",
                      "hover:bg-gray-50 transition-colors",
                      expandedCategories[category] && "bg-gray-50",
                      category === "UserType" &&
                        selectedFilters["UserType"]?.length > 0 &&
                        "bg-blue-50"
                    )}
                  >
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">
                        {category}
                      </span>
                      {getSelectedCount(category) > 0 && (
                        <span
                          className={cn(
                            "ml-2 text-white text-xs px-2 py-1 rounded-full",
                            category === "UserType"
                              ? "bg-blue-500"
                              : "bg-primary"
                          )}
                        >
                          {getSelectedCount(category)}
                        </span>
                      )}
                    </div>
                    {expandedCategories[category] ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>

                  {expandedCategories[category] && (
                    <div className="p-4 space-y-3 border-t">
                      {filters[category].subFilters.map((filter: any) => {
                        const isMultiple =
                          filters[category].selectType === "double";

                        return (
                          <label
                            key={filter}
                            className={cn(
                              "flex items-center space-x-3 cursor-pointer min-h-[44px] p-2 rounded",
                              selectedFilters[category]?.includes(filter) &&
                                category === "UserType" &&
                                "bg-blue-50"
                            )}
                          >
                            <div className="flex items-center">
                              <input
                                type={isMultiple ? "checkbox" : "radio"}
                                name={category}
                                value={filter}
                                checked={
                                  isMultiple
                                    ? selectedFilters[category]?.includes(
                                        filter
                                      )
                                    : selectedFilters[category]?.[0] === filter
                                }
                                onChange={() =>
                                  handleFilterSelect(category, filter)
                                }
                                className={cn(
                                  "w-5 h-5 border rounded-full appearance-none transition-all duration-200 ease-in-out",
                                  !isMultiple &&
                                    "checked:bg-white checked:border-primary checked:ring-2 checked:ring-primary",
                                  isMultiple &&
                                    "checked:bg-primary checked:border-primary",
                                  category === "UserType" &&
                                    "checked:border-blue-500 checked:ring-blue-200"
                                )}
                              />
                            </div>
                            <span
                              className={cn(
                                "text-gray-800",
                                selectedFilters[category]?.includes(filter) &&
                                  category === "UserType" &&
                                  "font-medium text-blue-700"
                              )}
                            >
                              {filter}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 flex justify-between space-x-2 sticky bottom-0 bg-background border-t">
            <Button
              variant="outline"
              onClick={() => clearFilters()}
              className="flex-1 border-gray-300 hover:bg-gray-50"
              size="lg"
            >
              Clear
            </Button>
            <Button onClick={applyFilters} className="flex-1" size="lg">
              Apply
            </Button>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex flex-col md:flex-row flex-1 overflow-hidden">
          <div className="w-full md:w-1/3 border-r">
            <DialogHeader className="p-4">
              <DialogTitle>Filters</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[calc(100%-73px)]">
              <div className="flex flex-col">
                {Object.keys(filters).map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "p-4 text-left hover:bg-accent/50 transition-colors flex justify-between items-center border-b",
                      activeCategory === category && "bg-accent",
                      category === "UserType" &&
                        selectedFilters["UserType"]?.length > 0 &&
                        "bg-blue-50"
                    )}
                  >
                    <span>{category}</span>
                    {getSelectedCount(category) > 0 && (
                      <span
                        className={cn(
                          "bg-primary text-white text-xs px-2 py-1 rounded-full",
                          category === "UserType" && "bg-blue-500"
                        )}
                      >
                        {getSelectedCount(category)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="w-full md:w-2/3 flex flex-col">
            <DialogHeader className="p-4">
              <DialogTitle>{activeCategory}</DialogTitle>
              {activeCategory === "UserType" &&
                selectedFilters["UserType"]?.length > 0 && (
                  <div className="text-sm text-blue-700 mt-1">
                    Selected: {selectedFilters["UserType"][0]}
                  </div>
                )}
            </DialogHeader>
            <ScrollArea className="flex-1">
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filters[activeCategory].subFilters.map((filter: any) => {
                  const isMultiple =
                    filters[activeCategory].selectType === "double";

                  return (
                    <label
                      key={filter}
                      className={cn(
                        "flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-accent/30 transition-colors",
                        selectedFilters[activeCategory]?.includes(filter) &&
                          activeCategory === "UserType" &&
                          "bg-blue-50"
                      )}
                    >
                      <div className="flex items-center">
                        <input
                          type={isMultiple ? "checkbox" : "radio"}
                          name={activeCategory}
                          value={filter}
                          checked={
                            isMultiple
                              ? selectedFilters[activeCategory]?.includes(
                                  filter
                                )
                              : selectedFilters[activeCategory]?.[0] === filter
                          }
                          onChange={() =>
                            handleFilterSelect(activeCategory, filter)
                          }
                          className={cn(
                            "appearance-none w-5 h-5 border rounded-full checked:bg-gray-100 checked:border-black transition-all duration-200 ease-in-out",
                            !isMultiple &&
                              "checked:ring-2 checked:ring-primary",
                            isMultiple &&
                              "checked:bg-primary checked:border-primary",
                            activeCategory === "UserType" &&
                              "checked:border-blue-500 checked:ring-blue-200"
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-sm sm:text-base",
                          selectedFilters[activeCategory]?.includes(filter) &&
                            activeCategory === "UserType" &&
                            "font-medium text-blue-700"
                        )}
                      >
                        {filter}
                      </span>
                    </label>
                  );
                })}
              </div>
            </ScrollArea>
            <Separator />
            <div className="p-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => clearFilters()}
                className="bg-gray-100 hover:bg-gray-200 text-inherit transition-colors duration-200 ease-in-out"
                size="sm"
              >
                Clear
              </Button>
              <Button
                onClick={applyFilters}
                className="transition-colors duration-200 ease-in-out cursor-pointer"
                size="sm"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Filter;
