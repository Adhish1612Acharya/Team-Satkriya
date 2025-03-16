import { useAuthContext } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const AuthProtectedRoute = () => {
  const { currentUser, loading} = useAuthContext();

  if (loading) return <p>Loading...</p>;

  // If the user is logged in, redirect them to their role-specific page
  if (currentUser) {
    return <Navigate to="/posts" replace />; // Fallback for unknown roles
  }

  return <Outlet />;
};

export default AuthProtectedRoute;
