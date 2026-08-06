import axios from "axios";
import "dotenv/config";

const verifyReceipt = async (receiptUrl) => {
  const API_KEY = process.env.API_KEY;
  console.log("Sending key:", API_KEY);
  console.log("Headers:", {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  });
  if (!API_KEY) {
    throw new Error("API_KEY is not configured on the server");
  }

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
