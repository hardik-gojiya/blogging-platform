import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { islogedin, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Checking authentication...
      </div>
    );
  }

  if (!islogedin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
