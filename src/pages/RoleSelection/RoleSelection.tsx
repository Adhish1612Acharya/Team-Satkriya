import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane as Plant2, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { RoleCard } from '@/components/role-card';
import RoleCard from "@/components/RoleCard/RoleCard";

type Role = "farmer" | "expert" | null;

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole === "farmer") {
      navigate("/farmer/login");
    } else if (selectedRole === "expert") {
      navigate("/expert/login");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 dark:from-indigo-950 dark:via-purple-950 dark:to-blue-900">
      <div className="w-full min-h-screen px-4 md:px-6 lg:px-8 py-6 md:py-12 lg:py-16 flex flex-col justify-center items-center">
        <div className="w-full mb-6 md:mb-8 lg:mb-12 text-center">
          <h1 className="mb-2 md:mb-3 lg:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-300 dark:to-purple-300">
            Welcome to AgriConnect
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-indigo-600 dark:text-indigo-300">
            Choose your role to get started
          </p>
        </div>

        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10 max-w-screen-xl">
          <RoleCard
            title="Farmer"
            description="Access farming resources, track crops, and get expert advice"
            icon={
              <Plant2 className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
            }
            selected={selectedRole === "farmer"}
            onClick={() => setSelectedRole("farmer")}
          />
          <RoleCard
            title="Expert"
            description="Share your agricultural expertise and help farmers"
            icon={
              <UserCog className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
            }
            selected={selectedRole === "expert"}
            onClick={() => setSelectedRole("expert")}
          />
        </div>

        {selectedRole && (
          <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 text-center">
            <Button
              size="lg"
              className="w-full xs:w-auto min-w-[200px] px-8 py-6 text-base sm:text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={handleContinue}
            >
              Continue as {selectedRole}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelection;
