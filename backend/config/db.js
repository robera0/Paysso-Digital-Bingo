import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URL;
const PORT = process.env.PORT;
const connectDB = async (app) => {
  try {
    const conn = await mongoose.connect(MONGO_URI).then(() => {
      console.log("MongoDB  is Connected");
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
