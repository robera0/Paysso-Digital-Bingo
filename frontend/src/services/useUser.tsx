import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";


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
  const res = await fetch(`/api/v1/auth/profile`, {
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

const UpdateProfile = async (data: User): Promise<User> => {
  const res = await axios.put(`/api/v1/auth/profile`, data.profile, {
    withCredentials: true,
  });

  const responseData: User = await res.data;

  return responseData;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profile: User) => UpdateProfile(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });

      toast.success("Profile updated successfully", {
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
