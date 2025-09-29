import express from "express";
import { getAllStores, getStoresAndRating, registerStores } from "../controllers/store.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const shopRouter = express.Router();

// store routes
shopRouter.post("/register",authMiddleware, registerStores);
shopRouter.get("/getshop",authMiddleware ,getAllStores);
shopRouter.post("/storesratings",authMiddleware, getStoresAndRating);

export default shopRouter;
