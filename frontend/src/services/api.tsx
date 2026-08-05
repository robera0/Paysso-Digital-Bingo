import { useQuery } from "@tanstack/react-query";

const VITE_API_URL: string = import.meta.env.VITE_API_URL;

export interface Box {
  boxNumber: number;
  prize: string;
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
  createdAt: string;
}

export interface TicketApiResponse {
  success: boolean;
  ticket: TicketResponse[];
}
// get Game
export const fetchGame = async (): Promise<ApiResponse> => {
  const res = await fetch(`${VITE_API_URL}/api/v1/game/newGame`);
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
  {
    const res = await fetch(`${VITE_API_URL}/api/v1/auth/ticket`, {
      credentials: "include",
    });
    const data: TicketApiResponse = await res.json();
    return data;
  }
};

export const useTicket = () => {
  return useQuery<TicketApiResponse>({
    queryKey: ["ticket"],
    queryFn: fetchTickets,
  });
};
