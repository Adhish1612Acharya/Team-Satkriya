import { useAuthContext } from "@/context/AuthContext";
import getUserInfo from "@/utils/getUserInfo";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ExpertProtectRoute = () => {
  const { currentUser, loading, userType, setUserType,setUsername } = useAuthContext();

  useEffect(() => {
    async function checkUserRole() {
      if (currentUser) {
        const userInfo = await getUserInfo(currentUser.uid, "experts");
        if (userInfo !== null) {
          setUserType(userInfo.role);
          setUsername(userInfo.name);
        } else {
          setUserType(null);
        }
      }
    }

    checkUserRole();
  }, [currentUser, setUserType]); // Add currentUser and setUserType as dependencies

  if (loading) return <p>Loading...</p>;

  if (!currentUser) {
    return <Navigate to="/auth" replace />; // Redirect to auth if no user is logged in
  }

  if (userType === "farmer") {
    return <Navigate to="/farmer/home" replace />; // Allow access if the user is a farmer
  }

  return <Outlet />;
};

export default ExpertProtectRoute;
