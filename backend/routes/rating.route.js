import express from 'express';
import { addRating, getMyRating } from '../controllers/rating.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const ratingRouter=express.Router();

// ratings routes
ratingRouter.post("/addrating", authMiddleware,addRating);
ratingRouter.get("/getrating", authMiddleware,getMyRating);

export default ratingRouter;