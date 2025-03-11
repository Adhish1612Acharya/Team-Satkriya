import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Ensure your Firebase config is correctly imported

 const addFiltersToFirestore = async () => {
  const filterData = {
    UserType: ["Doctors", "NGOs", "Volunteers", "Farmers"],
  
    PostType: [
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
      "Marketplace Listings"
    ],

    FarmerQueryType: ["Breeding Help", "Disease Concerns", "Feed Recommendations", "Government Schemes"],
  
    SuccessStoryType: ["High Milk Yield", "Disease Recovery", "Sustainable Farming"],

    MedicalFilters: ["Common Diseases", "Veterinary Treatments", "Home Remedies", "Balanced Diet", "Organic Feed", "Supplement Plans"],

    AgriculturalPractices: ["Zero-Budget Farming", "Natural Fertilizers", "Pesticide-Free Methods", "Artificial Insemination", "Genetic Benefits"],

    MilkProduction: ["Milking Methods", "Machine vs Hand Milking", "Sanitation Practices", "Milk Quality Improvement"],

    TechnologyInnovation: ["IoT in Dairy", "Automated Milking", "Smart Monitoring", "DNA Testing", "AI-Based Breed Selection"],

    GeographicalLocation: ["North", "South", "East", "West", "Central India"],

    PostAge: ["New (0-7 days)", "Recent (1-3 months)", "Old (3+ months)"]
  };

  try {
    const filterDocRef = doc(db, "filters", "masterFilters"); // Single document
    await setDoc(filterDocRef, filterData);
    console.log(" Filters successfully added to Firestore!");
  } catch (error) {
    console.error(" Error adding filters:", error);
  }
};

// Call this function once to add filters to Firestore
export default addFiltersToFirestore;
