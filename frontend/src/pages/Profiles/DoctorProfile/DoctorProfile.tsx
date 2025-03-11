import { useState } from "react";
import { useParams } from "react-router-dom";
import { 
  BookOpenIcon, 
  CalendarIcon, 
  HomeIcon, 
  MailIcon, 
  MapPinIcon, 
  PhoneIcon, 
  UserIcon 
} from "lucide-react";
import { ProfileCard } from "@/components/profiles/ProfileCard";
import { ProfileField } from "@/components/profiles/ProfileField";
import { DoctorProfile as DoctorProfileType } from "./DoctorProfile.types";

// Mock data - in a real app, this would come from an API
const mockDoctor: DoctorProfileType = {
  id: "doctor-123",
  name: "Dr. Priya Sharma",
  profilePhoto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
  uniqueId: "VET-MH-2023-1234",
  education: "BVSc & AH, MVSc (Veterinary Medicine)",
  yearsOfPractice: 8,
  phoneNumber: "+91 9876543211",
  email: "dr.priya@example.com",
  clinicLocation: "Veterinary Hospital, Aundh, Pune",
  address: "123 Vet Lane, Aundh, Pune"
};

export function DoctorProfile() {
  const { id } = useParams<{ id: string }>();

  if (!id) 
    return <p>Error: Farmer ID is missing in the URL!</p>
  const [doctor] = useState<DoctorProfileType>(mockDoctor);

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-500 mb-8">
          Doctor Profile
        </h1>
        
        <ProfileCard 
          profilePhoto={doctor.profilePhoto}
          name={doctor.name}
          role="Veterinary Doctor"
          theme="blue"
        >
          <div className="space-y-4">
            <ProfileField 
              label="Unique ID" 
              value={doctor.uniqueId} 
              theme="blue"
              icon={<UserIcon size={18} />}
            />
            
            <ProfileField 
              label="Education" 
              value={doctor.education} 
              theme="blue"
              icon={<BookOpenIcon size={18} />}
            />
            
            <ProfileField 
              label="Years of Practice" 
              value={`${doctor.yearsOfPractice} years`} 
              theme="blue"
              icon={<CalendarIcon size={18} />}
            />
            
            <ProfileField 
              label="Phone Number" 
              value={doctor.phoneNumber} 
              theme="blue"
              icon={<PhoneIcon size={18} />}
            />
            
            <ProfileField 
              label="Email" 
              value={doctor.email} 
              theme="blue"
              icon={<MailIcon size={18} />}
            />
            
            <ProfileField 
              label="Clinic Location" 
              value={doctor.clinicLocation} 
              theme="blue"
              icon={<MapPinIcon size={18} />}
            />
            
            <ProfileField 
              label="Address" 
              value={doctor.address || ""} 
              theme="blue"
              icon={<HomeIcon size={18} />}
            />
          </div>
        </ProfileCard>
      </div>
    </div>
  );
}

export default DoctorProfile;