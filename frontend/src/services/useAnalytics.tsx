import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
export interface GameItem {
  gameId: string;
  gameName: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | string;
  price: number;
  prizePool: number;
  ticketSold: number;
  remainingBoxes: number;
  activeAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
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

export interface UpdateGame {
  gameId: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
}

export const fetchLiveGameAnalytics = async (): Promise<LiveGameAnalytics> => {
  const res = await fetch(`/api/v1/live`, { credentials: "include" });
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
  const res = await fetch(`/api/v1/game`, { credentials: "include" });
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

// update the status of the game
export const UpdateGame = async (payload: UpdateGame) => {
  const res = await axios.put(`/api/v1/game`, payload, {
    withCredentials: true,
  });

  return res.data;
};

export const fetchTicketAnalytics = async (): Promise<Ticket> => {
  const res = await fetch(`/api/v1/ticket`, { credentials: "include" });
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

export const useUpdateGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateGame) => UpdateGame(payload),
    onSuccess: (_, payload) => {
      queryClient.setQueryData<GameListResponse>(
        ["allGameAnalytics"],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            Games: (oldData.Games || []).map((game) =>
              game.gameId === payload.gameId
                ? { ...game, status: payload.status }
                : game,
            ),
          };
        },
      );

      queryClient.setQueryData<LiveGameAnalytics>(
        ["liveGameAnalytics"],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            Games: (oldData.Games || []).map((game) =>
              game.gameId === payload.gameId
                ? { ...game, status: payload.status }
                : game,
            ),
          };
        },
      );

      queryClient.invalidateQueries({ queryKey: ["game"] });
      queryClient.invalidateQueries({ queryKey: ["allGameAnalytics"] });
      queryClient.invalidateQueries({ queryKey: ["liveGameAnalytics"] });
      queryClient.invalidateQueries({ queryKey: ["TicketAnalytics"] });
      toast.success("You Update the status of the Game successfully", {
        duration: 3000,
      });
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "You didn't update the status of the Game, try again";
        toast.error(message, { duration: 3000 });
      } else {
        toast.error("You didn't update the status of the Game, try again", {
          duration: 3000,
        });
      }
    },
  });
};

export const deleteGame = async (gameId: string) => {
  const res = await axios.delete(`/api/v1/game/${gameId}`, {
    withCredentials: true,
  });

  return res.data;
};

export const useDeleteGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gameId: string) => deleteGame(gameId),
    onSuccess: (_, gameId) => {
      queryClient.setQueryData<GameListResponse>(
        ["allGameAnalytics"],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            Games: (oldData.Games || []).filter(
              (game) => game.gameId !== gameId,
            ),
          };
        },
      );

      queryClient.setQueryData<LiveGameAnalytics>(
        ["liveGameAnalytics"],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            Games: (oldData.Games || []).filter(
              (game) => game.gameId !== gameId,
            ),
          };
        },
      );

      queryClient.invalidateQueries({ queryKey: ["game"] });
      queryClient.invalidateQueries({ queryKey: ["allGameAnalytics"] });
      queryClient.invalidateQueries({ queryKey: ["liveGameAnalytics"] });
      queryClient.invalidateQueries({ queryKey: ["TicketAnalytics"] });
      toast.success("Game deleted successfully", {
        duration: 3000,
      });
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "You couldn't delete the game, try again";
        toast.error(message, { duration: 3000 });
      } else {
        toast.error("You couldn't delete the game, try again", {
          duration: 3000,
        });
      }
    },
  });
};
