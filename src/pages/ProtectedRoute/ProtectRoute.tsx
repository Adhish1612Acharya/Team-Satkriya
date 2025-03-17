import { useAuthContext } from "@/context/AuthContext";
import getUserInfo from "@/utils/getUserInfo";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { currentUser, loading, setUserType, setUsername } =
    useAuthContext();
  const [isRoleChecked, setIsRoleChecked] = useState(false);

  useEffect(() => {
    let timeoutId; // To store the timeout ID
  
    async function checkUserRole() {
      if (currentUser) {
        const userTypeFromLS = localStorage.getItem("userType");
        console.log("FLS : ", userTypeFromLS);
  
        const userInfo = await getUserInfo(currentUser.uid, userTypeFromLS || "");
        if (userInfo) {
          setUserType(userInfo.role === "farmer" ? "farmers" : "experts");
          setUsername(userInfo.name);
        } else {
          setUserType(null);
        }
      }
      setIsRoleChecked(true); // Mark role check as complete
    }
  
    // Add a 1-second delay before running checkUserRole
    timeoutId = setTimeout(() => {
      checkUserRole();
    }, 1000);
  
    // Cleanup function to clear the timeout if the component unmounts or dependencies change
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [currentUser, localStorage.getItem("userType")]);

  if (loading || !isRoleChecked) {
    return <p>Loading...</p>; // Show loading indicator until role check is complete
  }

  return currentUser ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;