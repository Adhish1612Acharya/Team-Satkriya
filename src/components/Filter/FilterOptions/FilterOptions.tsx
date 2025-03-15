import { FC } from "react";
import { FilterOptionsProps } from "./FilterOptions.types";

const FilterOptions: FC<FilterOptionsProps> = ({
  mainFilter,
  filter,
  selectedFilters,
  setSelectedFilters,
  applyFilters,
  userType,
  setUserType
}) => {
  const toggleFilters = (type: string) => {
    if (selectedFilters.includes(type)) {
      setSelectedFilters(selectedFilters.filter((t) => t !== type));
    } else {
      setSelectedFilters([...selectedFilters, type]);
    }
  };

  const toggleSingleFilters = (type: string) => {
   setUserType(type.toLowerCase());
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100">
        {/* <Users className="h-4 w-4" /> */}
        <span>{mainFilter}</span>
      </button>
      <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-2">
          {filter.subFilters.map((subFilter) =>
            filter.selectType === "double" ? (
              <label
                key={subFilter}
                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(subFilter)}
                  onChange={() => toggleFilters(subFilter)}
                  className="rounded text-indigo-600"
                />
                <span className="ml-2 text-sm">{subFilter}</span>
              </label>
            ) : (
              <button
                key={subFilter}
                onClick={() =>
                  toggleSingleFilters(subFilter)
                }
                className={`px-3 py-1 rounded-full text-sm ${
                  subFilter.toLowerCase()===userType
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {subFilter}
              </button>
            )
          )}
        </div>
        <div
          className={`absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg transition-all duration-200 z-50`}
        >
          {/* Dropdown content */}
          <button
            onClick={applyFilters}
            className="w-full mt-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterOptions;
