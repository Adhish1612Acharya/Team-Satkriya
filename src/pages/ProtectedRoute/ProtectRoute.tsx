import { useAuthContext } from "@/context/AuthContext";
import getUserInfo from "@/utils/getUserInfo";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { currentUser, loading, setUserType, setUsername } =
    useAuthContext();
  const [isRoleChecked, setIsRoleChecked] = useState(false);

  useEffect(() => {
    async function checkUserRole() {
      if (currentUser) {
        const userTypeFromLS=localStorage.getItem("userType");
        const userInfo = await getUserInfo(currentUser.uid, userTypeFromLS || "");
        if (userInfo) {
          setUserType(userInfo.role==="farmer"?"farmers":"experts");
          setUsername(userInfo.name);
        } else {
          setUserType(null);
        }
      }
      setIsRoleChecked(true); // Mark role check as complete
    }

    checkUserRole();
  }, [currentUser]);

  if (loading || !isRoleChecked) {
    return <p>Loading...</p>; // Show loading indicator until role check is complete
  }

  return currentUser ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;