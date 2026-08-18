import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "../api";
import { toast } from "sonner";

export type UserRole = "user" | "admin";

export interface User {
  profile: {
    email: string;
    phone: string;
    fullName: string;
    password: string;
    currentPassword: string;
    username: string;
    updatedAt?: string;
    role: UserRole;
  };
}

const fetchProfile = async (): Promise<User> => {
  const res = await api.get(`/api/v1/auth/profile`);
  return res.data;
};

export const useProfile = () => {
  return useQuery<User>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
};

const UpdateProfile = async (data: User): Promise<User> => {
  const res = await api.put(`/api/v1/auth/profile`, data.profile);

  const responseData: User = res.data;

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
        error instanceof Error && (error as any).response?.data?.message
          ? (error as any).response.data.message
          : "Unable to update profile right now";

      toast.error(message, {
        duration: 4000,
      });
    },
  });
};
