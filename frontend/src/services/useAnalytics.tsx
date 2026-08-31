import { useQuery } from "@tanstack/react-query";

export interface Game {
  activeGame: number;
  unverifiedTicket: number;
  OpenedBox: number;
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

export const useGameAnalytics = () => {
  return useQuery<Game>({
    queryKey: ["gameAnalytics"],
    queryFn: fetchGameAnalytics,
  });
};
