import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VITE_API_URL: string = import.meta.env.VITE_API_URL;

export interface Credentials {
  email: string;
  password: string;
}

const loginUSer = async (credentials: Credentials) => {
  const res = await axios.post(
    `${VITE_API_URL}/api/v1/auth/login/user`,
    credentials,
    {
      withCredentials: true,
    },
  );
  const data = res.data;

  return data;
};
export interface SignupUser extends Credentials {
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
