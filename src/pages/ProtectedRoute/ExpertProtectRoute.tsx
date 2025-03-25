import PageLoader from "@/components/PageLoader/loader";
import { useAuthContext } from "@/context/AuthContext";
import getUserInfo from "@/utils/getUserInfo";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ExpertProtectRoute = () => {
  const { currentUser, loading, userType, setUserType, setUsername, setNav } =
    useAuthContext();
  const [checkRole, setCheckRole] = useState<boolean>(true);


  useEffect(() => {
    async function checkUserRole() {
      if (currentUser) {
        const userInfo = await getUserInfo(currentUser.uid, "experts");
        if (userInfo !== null) {
          setUserType("experts");
          setUsername(userInfo.name);
        } else {
          setUserType("farmers");
        }
        setCheckRole(false);
        setNav(true);
      }
    }

    checkUserRole();
  }, [currentUser]);

  if (checkRole || loading) return <PageLoader />;

  if (!currentUser) {
    return <Navigate to="/auth" replace />; // Redirect to auth if no user is logged in
  }

  if (userType === "farmers") {
    return <Navigate to="/" replace />; // Allow access if the user is a farmer
  }

  return <Outlet />;
};

export default ExpertProtectRoute;
