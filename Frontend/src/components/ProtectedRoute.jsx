import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ role, children }) => {
  const { user } = useAuth();

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
