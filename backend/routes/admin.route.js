import express from "express";
import { getStores, getUsers, updateStores, updateUser } from "../controllers/admin.controllers.js";

const adminRouter = express.Router();

adminRouter.get("/getusers", getUsers);
adminRouter.put("/users/:id", updateUser);

adminRouter.get("/getstores", getStores);
adminRouter.put("/stores/:id", updateStores);

export default adminRouter;
