import PageLoader from "@/components/PageLoader/loader";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthProtectedRoute = () => {
  const { currentUser, loading, setNav } = useAuthContext();

  useEffect(() => {
    if (!loading) {
      setNav(true);
    }
  },[loading]);

  if (loading) return <PageLoader />;

  // If the user is logged in, redirect them to their role-specific page
  if (currentUser) {
    return <Navigate to="/posts" replace />; // Fallback for unknown roles
  }

  return <Outlet />;
};

export default AuthProtectedRoute;
