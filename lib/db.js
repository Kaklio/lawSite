import mongoose from "mongoose";


//====== ADDED SO SCRIPTS CAN ACCESS ENV VARIABLES ======//

import * as dotenv from "dotenv"; // ensure this syntax in ESM
import path from "path";
import { fileURLToPath } from "url";

// Required for standalone scripts to resolve .env.local from root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

//====== ADDED SO SCRIPTS CAN ACCESS ENV VARIABLES ======//



const MONGODB_URI = process.env.MONGODB_URI; // Store this in your .env.local file

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
