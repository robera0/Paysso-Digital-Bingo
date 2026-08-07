import oditClient from "./oditClient.js";
const verifyReceipt = async (receiptUrl) => {
  const response = await oditClient.post("/verify", { url: receiptUrl });
  return response.data;
};

export default verifyReceipt;
