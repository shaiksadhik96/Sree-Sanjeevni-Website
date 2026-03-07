import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ role, children }) => {
  const { user, isInitialized } = useAuth();

  // Wait for auth to initialize from localStorage
  if (!isInitialized) {
    return null; // or a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    const nextPath = user.role === "admin" ? "/admin" : "/reception";
    return <Navigate to={nextPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
