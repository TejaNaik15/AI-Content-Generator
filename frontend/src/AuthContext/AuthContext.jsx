import { createContext, useContext, useEffect, useState } from "react";
import { checkUserAuthStatusAPI } from "../apis/user/usersAPI";
import { useQuery } from "@tanstack/react-query";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isServerDown, setIsServerDown] = useState(false);

  
  const { isError, isLoading, data, isSuccess, error } = useQuery({
    queryFn: checkUserAuthStatusAPI,
    queryKey: ["checkAuth"],
    retry: 2,
    retryDelay: 1000,
    onError: (error) => {
      if (error.message?.includes('Unable to reach the server')) {
        setIsServerDown(true);
      }
    }
  });
  
  useEffect(() => {
    if (isSuccess) {
      
    
      setIsAuthenticated(Boolean(data?.isAuthenticated));
    }
  }, [data, isSuccess]);

  
  const login = () => {
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    setIsAuthenticated(false);
  };

  if (isServerDown) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
        <div className="bg-white rounded-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Server Connection Error</h2>
          <p className="text-gray-700 mb-4">
            Unable to connect to the server. Please make sure the backend server is running.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ 
        isAuthenticated, 
        isError, 
        isLoading, 
        isSuccess, 
        login, 
        logout,
        error: error?.message
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};
