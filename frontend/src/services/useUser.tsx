import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { VITE_API_URL } from "./api";

export type UserRole = "user" | "admin";

export interface User {
  profile: {
    email: string;
    phone: string;
    fullName: string;
    username: string;
    updatedAt?: string;
    role: UserRole;
  };
}

const fetchProfile = async (): Promise<User> => {
  const res = await fetch(`${VITE_API_URL}/api/v1/auth/profile`, {
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Request failed with status ${res.status}`,
    );
  }
  const data: User = await res.json();

  return data;
};

export const useProfile = () => {
  return useQuery<User>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
};

const UpdateProfile = async (profile: User): Promise<User> => {
  const res = await axios.put(`${VITE_API_URL}/api/v1/auth/profile`, profile, {
    withCredentials: true,
  });

  const data: User = await res.data;

  return data;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profile: User) => UpdateProfile(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });

      toast.success("profile Updated  successfully", {
        duration: 3000,
      });
    },
    onError: (error: unknown) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Unable to update profile right now";

      toast.error(message, {
        duration: 4000,
      });
    },
  });
};
