import { useQuery } from "@tanstack/react-query";

export interface GameItem {
  gameId: string;
  gameName: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | string;
  price: number;
  prizePool: number;
  ticketSold: number;
  remainingBoxes: number;
  boxes?: Array<{
    _id: string;
    boxNumber: number;
    isOpened: boolean;
    openedBy?: string | null;
    openedAt?: string | null;
    prize?: { type?: string; value?: number } | null;
  }>;
}

export interface LiveGameAnalytics {
  success?: boolean;
  activeGame?: number;
  unverifiedTicket?: number;
  OpenedBox?: number;
  ActiveUsers?: number;
  soldTickets?: number;
  Games?: GameItem[];
}

export interface GameListResponse {
  success?: boolean;
  Games: GameItem[];
  sanitizedGame?: GameItem[];
}

interface Revenue {
  _id: null;
  totalRevenue: number;
}

export interface Ticket {
  TicketSold: number;
  TotalRevenue: Revenue[];
}

export const fetchLiveGameAnalytics = async (): Promise<LiveGameAnalytics> => {
  const res = await fetch(`/api/v1/live`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Request failed with status ${res.status}`,
    );
  }
  const data: LiveGameAnalytics = await res.json();
  return data;
};

export const fetchGameAnalytics = async (): Promise<GameListResponse> => {
  const res = await fetch(`/api/v1/`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Request failed with status ${res.status}`,
    );
  }

  const data = await res.json();
  const games = Array.isArray(data?.Games)
    ? data.Games
    : Array.isArray(data?.sanitizedGame)
      ? data.sanitizedGame
      : [];

  return {
    success: data.success ?? true,
    Games: games,
    sanitizedGame: games,
  };
};

export const fetchTicketAnalytics = async (): Promise<Ticket> => {
  const res = await fetch(`/api/v1/ticket`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Request failed with status ${res.status}`,
    );
  }
  const data: Ticket = await res.json();
  return data;
};

export const useAllGameAnalytics = () => {
  return useQuery<GameListResponse>({
    queryKey: ["allGameAnalytics"],
    queryFn: fetchGameAnalytics,
  });
};

export const useGameAnalytics = () => {
  return useQuery<LiveGameAnalytics>({
    queryKey: ["liveGameAnalytics"],
    queryFn: fetchLiveGameAnalytics,
  });
};

export const useTicketAnalytics = () => {
  return useQuery<Ticket>({
    queryKey: ["TicketAnalytics"],
    queryFn: fetchTicketAnalytics,
  });
};
