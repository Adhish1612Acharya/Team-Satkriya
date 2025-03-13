import { useState } from "react";
import { useParams } from "react-router-dom";
import { 
  BookOpenIcon, 
  HomeIcon, 
  MailIcon, 
  PhoneIcon, 
} from "lucide-react";
import { ProfileCard } from "@/components/profiles/ProfileCard";
import { ProfileField } from "@/components/profiles/ProfileField";
import { VolunteerProfile as VolunteerProfileType } from "./VolunteerProfile.types";

// Mock data - in a real app, this would come from an API
const mockVolunteer: VolunteerProfileType = {
  id: "volunteer-123",
  name: "Amit Patel",
  profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
  education: "B.Sc. Agriculture",
  phoneNumber: "+91 9876543213",
  email: "amit.patel@example.com",
  address: "78 Green Valley, Nashik, Maharashtra"
};

export function VolunteerProfile() {
  const { id } = useParams<{ id: string }>();

  if (!id) 
    return <p>Error: Farmer ID is missing in the URL!</p>

  const [volunteer] = useState<VolunteerProfileType>(mockVolunteer);

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-500 mb-8">
          Volunteer Profile
        </h1>
        
        <ProfileCard 
          profilePhoto={volunteer.profilePhoto}
          name={volunteer.name}
          role="Volunteer"
          theme="blue"
        >
          <div className="space-y-4">
            <ProfileField 
              label="Education" 
              value={volunteer.education} 
              theme="blue"
              icon={<BookOpenIcon size={18} />}
            />
            
            <ProfileField 
              label="Phone Number" 
              value={volunteer.phoneNumber} 
              theme="blue"
              icon={<PhoneIcon size={18} />}
            />
            
            <ProfileField 
              label="Email" 
              value={volunteer.email} 
              theme="blue"
              icon={<MailIcon size={18} />}
            />
            
            <ProfileField 
              label="Address" 
              value={volunteer.address || ""} 
              theme="blue"
              icon={<HomeIcon size={18} />}
            />
          </div>
        </ProfileCard>
      </div>
    </div>
  );
}