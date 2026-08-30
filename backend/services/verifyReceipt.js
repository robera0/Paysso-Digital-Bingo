import oditClient from "./oditClient.js";

//  recept image
export const verifyUserImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const response = await axios.post(
      "https://v.odit.et/api/verify-image",
      {
        images: [{ imageBase64 }],
      },
      {
        headers: {
          "x-api-key": process.env.ODIT_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "ODIT verification failed:",
      error.response?.data || error.message,
    );

    return res.status(error.response?.status || 500).json({
      message: "Image verification failed",
      error: error.response?.data || error.message,
    });
  }
};

// normal link

const verifyReceipt = async (receiptUrl) => {
  const response = await oditClient.post("/verify", { url: receiptUrl });
  return response.data;
};

export default verifyReceipt;
