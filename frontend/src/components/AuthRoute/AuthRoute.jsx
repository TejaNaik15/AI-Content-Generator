import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext/AuthContext";
import AuthCheckingComponent from "../Alert/AuthCheckingComponent.jsx";

const AuthRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, isError } = useAuth();
  
  // For iPhone Safari - always allow access if localStorage says authenticated
  const localAuth = (() => {
    try {
      const stored = localStorage.getItem('isAuthenticated');
      const timestamp = localStorage.getItem('authTimestamp');
      if (stored === 'true' && timestamp) {
        const now = Date.now();
        const authTime = parseInt(timestamp);
        // Valid for 24 hours
        return (now - authTime) < 24 * 60 * 60 * 1000;
      }
      return false;
    } catch {
      return false;
    }
  })();
  
  // iPhone Safari - if localStorage auth is valid, skip server check
  if (localAuth) {
    return children;
  }
  
  // Show loading while checking auth
  if (isLoading) {
    return <AuthCheckingComponent />;
  }
  
  // If authenticated via server, allow access
  if (isAuthenticated) {
    return children;
  }
  
  // Redirect to login
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AuthRoute;