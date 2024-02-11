import express from "express";
import { Login, Register } from "../controllers/userController.js"

const userRouter = express.Router();

userRouter.post("/register", Register);
userRouter.post("/login", Login);

export default userRouter;