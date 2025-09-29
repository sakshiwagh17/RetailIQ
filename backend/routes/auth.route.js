
import express from 'express';
import { authMiddleware } from "../middleware/auth.js";
import { meRoute } from "../controllers/auth.controller.js";

const authRouter =express.Router();

//Protected Routes
authRouter.get('/me',authMiddleware,meRoute);

export default authRouter;
