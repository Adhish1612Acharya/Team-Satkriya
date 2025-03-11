import { FC } from "react";
import { Building2, GraduationCap, Heart, Microscope } from "lucide-react";
import AuthLayoutExpertProps from "./AuthLayoutExpert.types";

const AuthLayoutExpert: FC<AuthLayoutExpertProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[80vh]">
        {/* Left Side (Intro Section) */}
        <div className="w-full md:w-1/2 bg-indigo-600 p-12 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-6">{title}</h2>
            <p className="text-indigo-200 mb-8">{subtitle}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6" />
              <span>Doctors</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building2 className="w-6 h-6" />
              <span>NGOs</span>
            </div>
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-6 h-6" />
              <span>Volunteers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Microscope className="w-6 h-6" />
              <span>Research</span>
            </div>
          </div>
        </div>

        {/* Right Side (Form Section) */}
        <div className="w-full md:w-1/2 p-12 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayoutExpert;
