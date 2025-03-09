interface DoctorSignUp {
  uniqueId: number;
  education: string;
  yearsOfPractice: number;
  clinicLocation: string;
}

interface NgoSignUp {
  name: string;
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

export type GoogleLoginProps = (role: string) => Promise<void>;

export interface SignUpArguTypes {
  email: string;
  password: string;
  name: string;
  address: string;
  contactNo: number;
  role: string;
  profileData: DoctorSignUp | NgoSignUp | ResearchInstSignUp | VolunteerSignUp;
}

export type SignUpArguProps = (
  data:SignUpArguTypes
) => Promise<void>;

export type CompleteProfile = (
  profileData: DoctorSignUp | NgoSignUp | ResearchInstSignUp | VolunteerSignUp
) => Promise<void>;
