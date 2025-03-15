export interface  FilterCategory  {
    selectType: "single" | "double";
    subFilters: string[];
  };
  
export   interface Filters {
  [key: string]:  FilterCategory;
    // TechnologyInnovation: FilterCategory;
    // UserType: FilterCategory;
    // MilkProduction: FilterCategory;
    // AgriculturalPractices: FilterCategory;
    // MedicalFilters: FilterCategory;
    // FarmerQueryType: FilterCategory;
    // PostAge: FilterCategory;
    // PostType: FilterCategory;
    // SuccessStoryType: FilterCategory;
  };