import PageLoader from "@/components/PageLoader/loader";
import { useAuthContext } from "@/context/AuthContext";
import getUserInfo from "@/utils/getUserInfo";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { currentUser, loading, setUserType, setUsername, setNav } =
    useAuthContext();
  const [isRoleChecked, setIsRoleChecked] = useState(false);

  useEffect(() => {
    async function checkUserRole() {
      if (currentUser) {
        let userInfo = await getUserInfo(currentUser.uid, "farmers");
        if (userInfo) {
          setUserType(userInfo.role === "farmer" ? "farmers" : "experts");
          setUsername(userInfo.name);
        } else {
          userInfo = await getUserInfo(currentUser.uid, "experts");
          if (userInfo) {
            setUserType(userInfo?.role === "farmer" ? "farmers" : "experts");
            setUsername(userInfo?.name);
          } else {
            setUserType(null);
            setUsername(null);
          }
        }
      }

      setIsRoleChecked(true);
      setNav(true);
    }
    checkUserRole();
  }, [currentUser]);

  if (loading || !isRoleChecked) {
    return <PageLoader />; // Show loading indicator until role check is complete
  }

  return currentUser && isRoleChecked ? (
    <Outlet />
  ) : (
    <Navigate to="/auth" replace />
  );
};

export default ProtectedRoute;
