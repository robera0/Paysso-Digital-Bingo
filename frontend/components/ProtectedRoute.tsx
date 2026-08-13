import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { VITE_API_URL } from "../src/services/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const checkAuth = async (): Promise<boolean> => {
 
  await axios.get(`${VITE_API_URL}/api/v1/auth/profile`, {
    withCredentials: true,
  });
  return true;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  const { data: isAuthenticated, isLoading, isError } = useQuery({
    queryKey: ["auth-check"],
    queryFn: checkAuth,
    retry: false,           // Don't retry on 401 — it just means logged out
    staleTime: 60_000,      
  });

  useEffect(() => {
    if (!isLoading && (isError || !isAuthenticated)) {
      navigate("/", { replace: true });
    }
  }, [isLoading, isError, isAuthenticated, navigate]);

  // Show nothing while the auth check is in flight
  if (isLoading) return null;

  // Auth failed — don't flash protected content before redirect fires
  if (isError || !isAuthenticated) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
