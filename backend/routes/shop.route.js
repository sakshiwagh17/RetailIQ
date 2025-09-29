import express from "express";
import { getAllStores, getStoresAndRating, registerStores } from "../controllers/store.controller.js";

const shopRouter = express.Router();

// store routes
shopRouter.post("/register", registerStores);
shopRouter.get("/getshop",getAllStores);
shopRouter.get("/storesratings", getStoresAndRating);

export default shopRouter;
