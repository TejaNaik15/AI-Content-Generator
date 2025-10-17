import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext/AuthContext";
import AuthCheckingComponent from "../Alert/AuthCheckingComponent.jsx";

const AuthRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, isError } = useAuth();
  
  
  const localAuth = (() => {
    try {
      const stored = localStorage.getItem('isAuthenticated');
      const timestamp = localStorage.getItem('authTimestamp');
      if (stored === 'true' && timestamp) {
        const now = Date.now();
        const authTime = parseInt(timestamp);
      
        return (now - authTime) < 24 * 60 * 60 * 1000;
      }
      return false;
    } catch {
      return false;
    }
  })();
  
  
  if (localAuth) {
    return children;
  }
  
  
  if (isLoading) {
    return <AuthCheckingComponent />;
  }
  
  
  if (isAuthenticated) {
    return children;
  }
  

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AuthRoute;
