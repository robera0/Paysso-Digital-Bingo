import axios from "axios";
const API_KEY = import.meta.env.API_KEY;
const verifyReceipt = async (receiptUrl: string) => {
  const response = await axios.post(
    "https://v.odit.et/api/verify",
    { url: receiptUrl },
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
    },
  );
  return response.data;
};

export default verifyReceipt;
