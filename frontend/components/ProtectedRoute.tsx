import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


interface ProtectedRouteProps {
  children: React.ReactNode;
}

const checkAuth = async (): Promise<boolean> => {
 
  await axios.get(`/api/v1/auth/profile`, {
    withCredentials: true,
  });
  return true;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  const { data: isAuthenticated, isLoading, isError } = useQuery({
    queryKey: ["auth-check"],
    queryFn: checkAuth,
    retry: false,           
    staleTime: 60_000,      
  });

  useEffect(() => {
    if (!isLoading && (isError || !isAuthenticated)) {
      navigate("/", { replace: true });
    }
  }, [isLoading, isError, isAuthenticated, navigate]);

  
  if (isLoading) return null;

  // Auth failed — don't flash protected content before redirect fires
  if (isError || !isAuthenticated) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
