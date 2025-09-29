import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getAllStores, getStoresAndRating, registerStores } from "../controllers/store.controller.js";

const shopRouter = express.Router();

// store routes
shopRouter.post("/register", authMiddleware, registerStores);
shopRouter.get("/getshop",getAllStores);
shopRouter.get("/storesratings", authMiddleware, getStoresAndRating);

export default shopRouter;
