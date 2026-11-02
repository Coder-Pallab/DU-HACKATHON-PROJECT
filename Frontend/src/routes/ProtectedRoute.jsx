import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const { user, isLoading, sessionError } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-600">
        Checking your session...
      </div>
    );
  }

  return user ? children : (
    <Navigate
      to="/login"
      replace
      state={{ from: location, sessionError: sessionError || undefined }}
    />
  );
}

export default ProtectedRoute;
