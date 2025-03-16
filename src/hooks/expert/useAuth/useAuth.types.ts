interface DoctorSignUp {
  uniqueId: number;
  education: string;
  yearsOfPractice: number;
}

interface NgoSignUp {
  organization: string;
}

interface ResearchInstSignUp {
  researchArea: string;
}

interface VolunteerSignUp {
  education: string;
}

export type SignInWithEmailPasswordProps = (
  email: string,
  password: string
) => Promise<void>;

export type GoogleLoginProps = () => Promise<void>;

export type GoogleSignUpProps = (
  role: "doctor" | "researchInstitution" | "ngo" | "volunteer",
  profileData: DoctorSignUp | NgoSignUp | ResearchInstSignUp | VolunteerSignUp,
  address:string,
  phoneNumber:number
) => Promise<void>;

export interface SignUpArguTypes {
  email: string;
  password: string;
  name: string;
  address: string;
  contactNo: number;
  role: "doctor" | "researchInstitution" | "ngo" | "volunteer";
  profileData: DoctorSignUp | NgoSignUp | ResearchInstSignUp | VolunteerSignUp;
}

export type SignUpArguProps = (data: SignUpArguTypes) => Promise<void>;

export type CompleteProfile = (
  profileData: DoctorSignUp | NgoSignUp | ResearchInstSignUp | VolunteerSignUp
) => Promise<void>;
