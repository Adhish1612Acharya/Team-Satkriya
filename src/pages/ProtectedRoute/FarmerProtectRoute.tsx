import { useAuthContext } from "@/context/AuthContext";
import getUserInfo from "@/utils/getUserInfo";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const FarmerProtectRoute = () => {
  const { currentUser, loading, userType, setUserType } = useAuthContext();

  useEffect(() => {
    async function checkUserRole() {
      if (currentUser) {
        const userInfo = await getUserInfo(currentUser.uid, "farmers");
        if (userInfo !== null) {
          setUserType(userInfo.role); 
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
    return <Outlet />; // Allow access if the user is a farmer
  }

  return <Navigate to="/expert/home" replace />;
};

export default  FarmerProtectRoute;
