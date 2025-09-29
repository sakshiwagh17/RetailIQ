import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { connectDB } from "./lib/db.js";
import adminRouter from "./routes/admin.route.js";
import shopRouter from "./routes/shop.route.js";
import userRoute from "./routes/user.route.js";
import ratingRouter from "./routes/rating.route.js";
import router from "./routes/auth.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // connecting frontend
  credentials: true               
}));

app.use("/api/auth",authRouter);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRouter);
app.use("/api/shops", shopRouter);
app.use("/api/rating", ratingRouter);

// Start server only after DB connects
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // exit process if DB fails
  }
};

startServer();
