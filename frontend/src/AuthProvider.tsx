// AuthProvider.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import axios from "axios";
import { setAccessToken } from "./tokenStore";

import { TwinOrbit } from "@/components/loading-ui/twin-orbit";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const silentLogin = async () => {
      try {
        const { data } = await axios.post(
          `/api/v1/refresh`,
          {},
          { withCredentials: true },
        );
        setAccessToken(data.accessToken);
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setAuthChecked(true);
      }
    };
    silentLogin();
  }, []);

  if (!authChecked) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50/50">
        <TwinOrbit />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
