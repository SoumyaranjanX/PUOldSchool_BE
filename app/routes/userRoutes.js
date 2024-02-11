import express from "express";
import { Register } from "../controllers/userController.js"

const userRouter = express.Router();

userRouter.post("/register", Register);
export default userRouter;