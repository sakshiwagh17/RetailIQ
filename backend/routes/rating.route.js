import express from 'express';
import { addRating, getMyRating } from '../controllers/rating.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const ratingRouter=express.Router();

// ratings routes
ratingRouter.post("/ratings", authMiddleware, addRating);
ratingRouter.get("/ratings/my", authMiddleware, getMyRating);

export default ratingRouter;