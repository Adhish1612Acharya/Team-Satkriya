import { useState } from "react";
import { useParams } from "react-router-dom";
import { 
  CalendarIcon, 
  HomeIcon, 
  LanguagesIcon, 
  MapPinIcon, 
  PhoneIcon 
} from "lucide-react";
import { ProfileCard } from "@/components/profiles/ProfileCard"; // Corrected import
import { ProfileField } from "@/components/profiles/ProfileField"; // Corrected import
import { FarmerProfile as FarmerProfileType } from "./FarmerProfile.types"; // Corrected import

// Mock data - in a real app, this would come from an API
const mockFarmer: FarmerProfileType = {
  id: "farmer-123",
  name: "Rajesh Kumar",
  profilePhoto: "https://images.unsplash.com/photo-1628102491629-778571d893a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
  phoneNumber: "+91 9876543210",
  email: "rajesh.kumar@example.com",
  language: "Hindi, Marathi",
  state: "Maharashtra",
  city: "Pune",
  experience: 15,
  address: "Village Kothrud, Pune District"
};

export function FarmerProfile() {
  const { id } = useParams<{ id: string }>();

  if (!id) 
    return <p>Error: Farmer ID is missing in the URL!</p>

  const [farmer] = useState<FarmerProfileType>(mockFarmer);

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 dark:text-green-500 mb-8">
          Farmer Profile
        </h1>
        
        <ProfileCard 
          profilePhoto={farmer.profilePhoto}
          name={farmer.name}
          role="Farmer"
          theme="green"
        >
          <div className="space-y-4">
            <ProfileField 
              label="Phone Number" 
              value={farmer.phoneNumber} 
              theme="green"
              icon={<PhoneIcon size={18} />}
            />
            
            <ProfileField 
              label="Languages" 
              value={farmer.language} 
              theme="green"
              icon={<LanguagesIcon size={18} />}
            />
            
            <ProfileField 
              label="Location" 
              value={`${farmer.city}, ${farmer.state}`} 
              theme="green"
              icon={<MapPinIcon size={18} />}
            />
            
            <ProfileField 
              label="Address" 
              value={farmer.address || ""} 
              theme="green"
              icon={<HomeIcon size={18} />}
            />
            
            <ProfileField 
              label="Experience" 
              value={`${farmer.experience} years`} 
              theme="green"
              icon={<CalendarIcon size={18} />}
            />
          </div>
        </ProfileCard>
      </div>
    </div>
  );
}
