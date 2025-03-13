import { useAuthContext } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = () => {
  const { currentUser, loading } = useAuthContext();

  if (loading) return <p>Loading...</p>;

  return currentUser ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
