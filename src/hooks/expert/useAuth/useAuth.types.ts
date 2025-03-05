interface DoctorSignUp {
  type: "doctor";
  email: string;
  phoneNumber: string;
  address: string;
  name: string;
  uniqueId: string;
  education: string;
  yearsOfPractice: number;
  clinicLocation: string;
}

interface NgoSignUp {
  type: "ngo";
  email: string;
  phoneNumber: string;
  address: string;
  name: string;
  organization: string;
}

interface ResearchInstSignUp {
  type: "research";
  email: string;
  phoneNumber: string;
  address: string;
  name: string;
}

interface VolunteerSignUp {
  type: "volunteer";
  email: string;
  phoneNumber: string;
  address: string;
  name: string;
  education: string;
}

export type SignInWithEmailPasswordProps = (
  email: string,
  password: string
) => Promise<void>;

export type GoogleLoginProps = (role: string) => Promise<void>;

export type SignUpArguProps = (
  email: string,
  password: string,
  username: string,
  address: string,
  contactNo: string,
  role: string,
  profileData: DoctorSignUp | NgoSignUp | ResearchInstSignUp | VolunteerSignUp
) => Promise<void>;

export type CompleteProfile = (
  profileData: DoctorSignUp | NgoSignUp | ResearchInstSignUp | VolunteerSignUp
) => Promise<void>;
