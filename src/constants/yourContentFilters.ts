import { Filters } from "@/types/filter.types";

const yourContentFilters: Filters = {
  TechnologyInnovation: {
    selectType: "double",
    subFilters: [
      "IoT in Dairy",
      "Automated Milking",
      "Smart Monitoring",
      "DNA Testing",
      "AI-Based Breed Selection",
    ],
  },

  MilkProduction: {
    selectType: "double",
    subFilters: [
      "Milking Methods",
      "Machine vs Hand Milking",
      "Sanitation Practices",
      "Milk Quality Improvement",
    ],
  },
  AgriculturalPractices: {
    selectType: "double",
    subFilters: [
      "Zero-Budget Farming",
      "Natural Fertilizers",
      "Pesticide-Free Methods",
      "Artificial Insemination",
      "Genetic Benefits",
    ],
  },
  MedicalFilters: {
    selectType: "double",
    subFilters: [
      "Common Diseases",
      "Veterinary Treatments",
      "Home Remedies",
      "Balanced Diet",
      "Organic Feed",
      "Supplement Plans",
    ],
  },
  FarmerQueryType: {
    selectType: "double",
    subFilters: [
      "Breeding Help",
      "Disease Concerns",
      "Feed Recommendations",
      "Government Schemes",
    ],
  },
  PostType: {
    selectType: "double",
    subFilters: [
      "Medical Advice",
      "Disease Prevention",
      "Nutrition Plans",
      "Vaccination Schedules",
      "Training Programs",
      "Funding Opportunities",
      "Sustainability Initiatives",
      "Community Engagement",
      "On-Ground Assistance",
      "Skill Training",
      "Queries",
      "Success Stories",
      "Marketplace Listings",
    ],
  },
  SuccessStoryType: {
    selectType: "double",
    subFilters: ["High Milk Yield", "Disease Recovery", "Sustainable Farming"],
  },
};

export default yourContentFilters;
