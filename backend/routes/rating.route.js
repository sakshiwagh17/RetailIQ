import express from 'express';
import { addRating, getMyRating } from '../controllers/rating.controller.js';

const ratingRouter=express.Router();

// ratings routes
ratingRouter.post("/ratings", addRating);
ratingRouter.get("/ratings/my", getMyRating);

export default ratingRouter;