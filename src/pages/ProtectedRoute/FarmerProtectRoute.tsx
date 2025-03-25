import PageLoader from "@/components/PageLoader/loader";
import { useAuthContext } from "@/context/AuthContext";
import getUserInfo from "@/utils/getUserInfo";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const FarmerProtectRoute = () => {
  const { currentUser, userType,loading, setUserType, setUsername,setNav } =
    useAuthContext();
    const [checkRole,setCheckRole]=useState<boolean>(true);

  useEffect(() => {
    async function checkUserRole() {
      if (currentUser) {
        const userInfo = await getUserInfo(currentUser.uid, "farmers");
        if (userInfo !== null) {
          setUserType("farmers");
          setUsername(userInfo.name);
        } else {
          setUserType("experts");
        }

        setCheckRole(false);
        setNav(true);
      }
    }

    checkUserRole();
  }, [currentUser, setUserType]); 

  if (checkRole || loading) return <PageLoader />

  if (!currentUser) {
    return <Navigate to="/auth" replace />; // Redirect to auth if no user is logged in
  }

  if (userType === "farmers") {
    return <Outlet />; // Allow access if the user is a farmer
  }

  return <Navigate to="/" replace />;
};

export default FarmerProtectRoute;
