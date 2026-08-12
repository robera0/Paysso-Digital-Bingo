import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { VITE_API_URL } from "./api";
export interface VerifyTicket {
  receiptUrl: string;
  boxId: string;
}

export const verifyReceipt = async (verifyTicket: VerifyTicket) => {
  const res = await axios.post(
    `${VITE_API_URL}/api/v1/auth/verify-receipt`,
    verifyTicket,
    {
      withCredentials: true,
    },
  );
  const data = res.data;

  return data;
};

export const useVerify = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (verifyTicket: VerifyTicket) => verifyReceipt(verifyTicket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket"] });

      toast.success("Ticket Verified  successfully", {
        duration: 3000,
      });
    },
  });
};
