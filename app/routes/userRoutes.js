import express from "express";
import { Login, Register, logout } from "../controllers/userController.js"
import { verifyJWT } from "../middlewares/authMiddleware.js";


const userRouter = express.Router();

userRouter.post("/register", Register);
userRouter.post("/login", Login);
userRouter.post("/logout", verifyJWT, logout);

export default userRouter;