import { FC, useState } from "react";

import {
  Heart,
  Building2,
  GraduationCap,
  Microscope,
  LockIcon,
} from "lucide-react";
import DoctorSignUpForm from "@/components/Forms/Expert/ExpertSignUpForm/DoctorSignUpForm/DoctorSignUpForm";
import NgoSignUpForm from "@/components/Forms/Expert/ExpertSignUpForm/NgoSignUpForm/NgoSignUpForm";
import ResearchInstSignUpForm from "@/components/Forms/Expert/ExpertSignUpForm/ResearchInstSignUpForm/ResearchInstSignUpForm";
import VolunteerSignUpForm from "@/components/Forms/Expert/ExpertSignUpForm/VolunteerSignUpForm/VolunteerSignUpForm";
import AuthLayoutExpert from "@/components/AuthLayoutExpert/AuthLayoutExpert";
import Button from "@/components/Button/Button";

const userTypeOptions = [
  { type: "doctor", label: "Doctor", icon: Heart },
  { type: "ngo", label: "NGO", icon: Building2 },
  { type: "volunteer", label: "Volunteer", icon: GraduationCap },
  { type: "research", label: "Research Institution", icon: Microscope },
];

const RegisterExpert: FC = () => {
  const [userType, setUserType] = useState<string | null>(null);

  return (
    <AuthLayoutExpert
      title="Create an Account"
      subtitle="Join our community and make a difference."
    >
      {!userType ? (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">
            Select your role
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {userTypeOptions.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => {
                  setUserType(type);
                }}
                className="p-4 border-2 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors duration-200"
              >
                <Icon className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                <span className="block text-sm font-medium text-gray-900">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {" "}
          <div className="flex items-center mb-4 justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Register as {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </h3>
            <button
              type="button"
              onClick={() => {
                setUserType(null);
              }}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Change role
            </button>{" "}
          </div>
          {userType === "doctor" && <DoctorSignUpForm />}
          {userType === "ngo" && <NgoSignUpForm />}
          {userType === "research" && <ResearchInstSignUpForm />}
          {userType === "volunteer" && <VolunteerSignUpForm />}
          <div className="flex flex-col items-center gap-3 w-full">
            <Button
              icon={LockIcon}
              type="button"
              className="mt-2"
              fullWidth
              variant="outline"
            >
              Sign up with Google
            </Button>
            <p className="text-center text-sm text-gray-600 mt-2">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign in
              </a>
            </p>
          </div>
        </>
      )}
    </AuthLayoutExpert>
  );
};

export default RegisterExpert;
