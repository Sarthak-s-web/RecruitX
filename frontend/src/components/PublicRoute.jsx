import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export default function PublicRoute({ children }) {
  const { isAuthenticated, isRecruiter, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={isRecruiter ? "/recruiter/dashboard" : "/jobs"} replace />;
  }

  return children;
}
