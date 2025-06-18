import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { islogedin } = useAuth();

  if (!islogedin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
