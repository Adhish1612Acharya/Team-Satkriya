import { useState } from "react";
import { useParams } from "react-router-dom";
import { 
  
  CalendarIcon, 
  HomeIcon, 
  MailIcon, 
  PhoneIcon 
} from "lucide-react";
import { ProfileCard } from "@/components/profiles/ProfileCard";
import { ProfileField } from "@/components/profiles/ProfileField";
import { ResearchInstituteProfile as ResearchInstituteProfileType } from "./ResearchInstituteProfile.types";

// Mock data - in a real app, this would come from an API
const mockInstitute: ResearchInstituteProfileType = {
  id: "institute-123",
  name: "National Dairy Research Institute",
  profilePhoto: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
  phoneNumber: "+91 1234567890",
  email: "contact@ndri.org",
  address: "NDRI Campus, Karnal, Haryana - 132001",
  establishmentDate: "1954-02-16"
};

export function ResearchInstituteProfile() {
  const { id } = useParams<{ id: string }>();

  if (!id) 
    return <p>Error: Farmer ID is missing in the URL!</p>

  const [institute] = useState<ResearchInstituteProfileType>(mockInstitute);

  // Format the establishment date
  const formattedDate = new Date(institute.establishmentDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-500 mb-8">
          Research Institute Profile
        </h1>
        
        <ProfileCard 
          profilePhoto={institute.profilePhoto}
          name={institute.name}
          role="Research Institute"
          theme="blue"
        >
          <div className="space-y-4">
            <ProfileField 
              label="Phone Number" 
              value={institute.phoneNumber} 
              theme="blue"
              icon={<PhoneIcon size={18} />}
            />
            
            <ProfileField 
              label="Email" 
              value={institute.email} 
              theme="blue"
              icon={<MailIcon size={18} />}
            />
            
            <ProfileField 
              label="Address" 
              value={institute.address || ""} 
              theme="blue"
              icon={<HomeIcon size={18} />}
            />
            
            <ProfileField 
              label="Establishment Date" 
              value={formattedDate} 
              theme="blue"
              icon={<CalendarIcon size={18} />}
            />
          </div>
        </ProfileCard>
      </div>
    </div>
  );
}