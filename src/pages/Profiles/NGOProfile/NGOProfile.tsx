import { useState } from "react";
import { useParams } from "react-router-dom";
import { 
  BuildingIcon, 
  CalendarIcon, 
  HomeIcon, 
  MailIcon, 
  PhoneIcon 
} from "lucide-react";
import { ProfileCard } from "@/components/profiles/ProfileCard";
import { ProfileField } from "@/components/profiles/ProfileField";
import { NGOProfile as NGOProfileType } from "./NGOProfile.types";

// Mock data - in a real app, this would come from an API
const mockNGO: NGOProfileType = {
  id: "ngo-123",
  name: "Cow Protection Foundation",
  profilePhoto: "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
  organizationName: "Bharatiya Go Seva Sangh",
  phoneNumber: "+91 9876543212",
  email: "info@cowprotection.org",
  address: "45 Rural Development Road, Nagpur, Maharashtra",
  establishmentDate: "2010-05-15"
};

export function NGOProfile() {
  const { id } = useParams<{ id: string }>();
  if (!id) 
    return <p>Error: Farmer ID is missing in the URL!</p>
 const [ngo] = useState<NGOProfileType>(mockNGO);

  // Format the establishment date
  const formattedDate = new Date(ngo.establishmentDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-500 mb-8">
          NGO Profile
        </h1>
        
        <ProfileCard 
          profilePhoto={ngo.profilePhoto}
          name={ngo.name}
          role="Non-Governmental Organization"
          theme="blue"
        >
          <div className="space-y-4">
            <ProfileField 
              label="Organization" 
              value={ngo.organizationName} 
              theme="blue"
              icon={<BuildingIcon size={18} />}
            />
            
            <ProfileField 
              label="Phone Number" 
              value={ngo.phoneNumber} 
              theme="blue"
              icon={<PhoneIcon size={18} />}
            />
            
            <ProfileField 
              label="Email" 
              value={ngo.email} 
              theme="blue"
              icon={<MailIcon size={18} />}
            />
            
            <ProfileField 
              label="Address" 
              value={ngo.address || ""} 
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