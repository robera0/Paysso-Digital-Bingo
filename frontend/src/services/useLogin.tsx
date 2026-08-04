import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const VITE_API_URL: string = import.meta.env.VITE_API_URL;

export interface Credentials {
  email: string;
  password: string;
}

const loginUSer = async (credentials: Credentials) => {
  const res = await axios.post(`${VITE_API_URL}/login/user`, credentials, {
    withCredentials: true,
  });
  const data = res.data;

  return data;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: Credentials) => loginUSer(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/game");
    },
  });
};
