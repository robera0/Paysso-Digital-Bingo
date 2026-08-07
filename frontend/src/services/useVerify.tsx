import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const VITE_API_URL: string = import.meta.env.VITE_API_URL;

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
