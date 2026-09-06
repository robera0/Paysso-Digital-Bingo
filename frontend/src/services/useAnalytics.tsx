import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "./api";

export interface Game {
  activeGame: number;
  unverifiedTicket: number;
  OpenedBox: number;
  ActiveUsers: number;
  soldTickets: number;
  Games: ApiResponse[];
}
interface Revenue {
  _id: null;
  totalRevenue: number;
}
export interface Ticket {
  TicketSold: number;
  TotalRevenue: Revenue[];
}

export const fetchGameAnalytics = async (): Promise<Game> => {
  const res = await fetch(`/api/v1/game/live`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Request failed with status ${res.status}`,
    );
  }
  const data: Game = await res.json();

  return data;
};

export const fetchTicketAnalytics = async (): Promise<Ticket> => {
  const res = await fetch(`/api/v1/game/ticket`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Request failed with status ${res.status}`,
    );
  }
  const data: Ticket = await res.json();

  return data;
};

export const useGameAnalytics = () => {
  return useQuery<Game>({
    queryKey: ["gameAnalytics"],
    queryFn: fetchGameAnalytics,
  });
};

export const useTicketAnalytics = () => {
  return useQuery<Ticket>({
    queryKey: ["TicketAnalytics"],
    queryFn: fetchTicketAnalytics,
  });
};
