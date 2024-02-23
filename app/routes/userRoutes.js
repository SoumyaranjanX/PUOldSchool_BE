import express from "express";
import { Login, Register, Logout, forgotPassword, resetPassword } from "../controllers/userController.js"
import { verifyJWT } from "../middlewares/authMiddleware.js";


const userRouter = express.Router();

userRouter.post("/register", Register);
userRouter.post("/login", Login);
userRouter.post("/logout", verifyJWT, Logout);
userRouter.post("/forgetpassword", forgotPassword);
userRouter.put("/resetpassword/:token", resetPassword);
export default userRouter;