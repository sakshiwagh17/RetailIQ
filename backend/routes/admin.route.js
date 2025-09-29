import express from "express";
import { getCounts, getStores, getUsers, updateStores, updateUser } from "../controllers/admin.controllers.js";
import { authMiddleware } from "../middleware/auth.js";

const adminRouter = express.Router();

adminRouter.get("/getusers",authMiddleware, getUsers);
adminRouter.put("/users/:id", updateUser);
adminRouter.get('/admin/getCounts',authMiddleware,getCounts)
adminRouter.get("/getstores",authMiddleware, getStores);
adminRouter.put("/stores/:id", updateStores);

export default adminRouter;
