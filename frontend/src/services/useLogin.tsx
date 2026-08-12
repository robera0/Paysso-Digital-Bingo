import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { VITE_API_URL } from "./api";
export interface Credentials {
  email?: string;
  identifier?: string;
  phone?: string;
  password: string;
}

const loginUSer = async (credentials: Credentials) => {
  const rawIdentifier = (
    credentials.identifier ??
    credentials.email ??
    credentials.phone ??
    ""
  ).trim();
  const payload = {
    password: credentials.password,
    ...(rawIdentifier.includes("@")
      ? { email: rawIdentifier }
      : { phone: rawIdentifier }),
  };

  const res = await axios.post(`${VITE_API_URL}/api/v1/login/user`, payload, {
    withCredentials: true,
  });
  const data = res.data;

  return data;
};
export interface SignupUser {
  email: string;
  password: string;
  phone: string;
  fullname: string;
  username: string;
}
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: Credentials) => loginUSer(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/game");

      toast.success("Logged in successfully", {
        duration: 3000,
      });
    },
    onError: (error: unknown) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Unable to login right now";

      toast.error(message, {
        duration: 4000,
      });
    },
  });
};

const registerUser = async (credentials: SignupUser) => {
  const payload = {
    email: credentials.email.trim(),
    password: credentials.password,
    phone: credentials.phone.trim(),
    fullname: credentials.fullname.trim(),
    username: credentials.username.trim(),
  };

  const res = await axios.post(`${VITE_API_URL}/api/v1/signup/user`, payload, {
    withCredentials: true,
  });

  return res.data;
};

export const useSignUp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: SignupUser) => registerUser(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/game");

      toast.success("Account created successfully", {
        duration: 3000,
      });
    },
    onError: (error: unknown) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Unable to create account right now";

      toast.error(message, {
        duration: 4000,
      });
    },
  });
};
const logoutUser = async () => {
  const res = await axios.post(
    `${VITE_API_URL}/api/v1/logout/user`,
    {},
    {
      withCredentials: true,
    },
  );
  return res.data;
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear();
      navigate("/");
      toast.success("Logged out successfully");
    },
    onError: () => {
      toast.error("Failed to logout");
    },
  });
};
