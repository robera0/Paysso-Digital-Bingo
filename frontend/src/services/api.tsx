import { useQuery } from "@tanstack/react-query";

const VITE_API_URL: string = import.meta.env.VITE_API_URL;

export interface Box {
  boxNumber: number;
  prize: string;
  isOpened: boolean;
  openedBy: string;
  openedAt: string;
}
export interface ApiResponse {
  success?: boolean;
  gameId: string;
  status: string;
  remainingBoxes: number;
  boxes: Box[];
}
export const fetchGame = async (): Promise<ApiResponse> => {
  const res = await fetch(`${VITE_API_URL}/newGame`);
  const data: ApiResponse = await res.json();

  return data;
};

export const useGame = () => {
  return useQuery<ApiResponse>({
    queryKey: ["game"],
    queryFn: fetchGame,
  });
};
