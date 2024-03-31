import express from "express";
import {
    Login,
    Register,
    Logout,
    forgotPassword,
    resetPassword,
    getUser,
    changeProfileImage,
    updatePersonalDetails
}
    from "../controllers/userController.js"
import { verifyJWT } from "../middlewares/authMiddleware.js";
import multer from "multer";

const upload = multer({
    dest: 'temp/',
});

const userRouter = express.Router();

//
userRouter.post("/register", Register);
userRouter.post("/login", Login);
userRouter.post("/logout", verifyJWT, Logout);

//
userRouter.post("/forgetpassword", forgotPassword);
userRouter.put("/resetpassword/:token", resetPassword);

//
userRouter.get("/getUser", verifyJWT, getUser);
userRouter.post("/changeProfileImage", verifyJWT, upload.single('image'), changeProfileImage);
userRouter.post("/updatePersonalDetails", verifyJWT, updatePersonalDetails);

export default userRouter;