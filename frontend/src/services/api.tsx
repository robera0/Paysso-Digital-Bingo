import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const VITE_API_URL: string = import.meta.env.VITE_API_URL;

export interface Box {
  boxNumber: number;
  prize: string;
  _id: string;
  isOpened: boolean;
  openedBy: string;
  openedAt: string;
}
// for game
export interface ApiResponse {
  success?: boolean;
  gameId: string;
  status: string;
  remainingBoxes: number;
  boxes: Box[];
}

// for tickets
export interface TicketResponse {
  _id: string;
  gameId: string;
  user: string;
  isVerified: boolean;
  verificationExpiresAt: string;
  boxId: string;
  boxNumber?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TicketApiResponse {
  success: boolean;
  ticket: TicketResponse[];
}

// get Game
export const fetchGame = async (): Promise<ApiResponse> => {
  const res = await fetch(`${VITE_API_URL}/api/v1/game/new-game`);
  const data: ApiResponse = await res.json();

  return data;
};

export const useGame = () => {
  return useQuery<ApiResponse>({
    queryKey: ["game"],
    queryFn: fetchGame,
  });
};
// get tickets
export const fetchTickets = async (): Promise<TicketApiResponse> => {
  const res = await fetch(`${VITE_API_URL}/api/v1/auth/ticket`, {
    credentials: "include",
  });
  const data: TicketApiResponse = await res.json();
  return data;
};

export const useTicket = () => {
  return useQuery<TicketApiResponse>({
    queryKey: ["ticket"],
    queryFn: fetchTickets,
  });
};
export interface PurchasedTicketApiResponse {
  boxNumber: number;
  gameId: string;
}
export const purchaseTicket = async (payload: PurchasedTicketApiResponse) => {
  const res = await axios.post(`${VITE_API_URL}/api/v1/auth/ticket`, payload, {
    withCredentials: true,
  });
  console.log(payload);
  const data = res.data;

  return data;
};

export const usePurchaseTicket = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (payload: PurchasedTicketApiResponse) =>
      purchaseTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
      queryClient.invalidateQueries({ queryKey: ["game"] });
      navigate("/game/ticket");
      toast.success("You held the ticket successfully", {
        duration: 3000,
      });
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "You didn't hold the ticket, try again";
        toast.error(message, { duration: 3000 });
      } else {
        toast.error("You didn't hold the ticket, try again", {
          duration: 3000,
        });
      }
    },
  });
};
