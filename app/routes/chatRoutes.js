
import express from "express";

import {createMessage,fetchMessages,createThread,getMyThreads,deleteThreadAndMessages,fetchThreadMessages} from "../controllers/chatControoler.js"
import { verifyJWT } from "../middlewares/authMiddleware.js";

const chatRouter = express.Router();
chatRouter.post("/message", createMessage);
chatRouter.post("/createThread", verifyJWT, createThread);
chatRouter.delete("/deleteThreadAndMessages", verifyJWT, deleteThreadAndMessages);
chatRouter.get("/getMyThreads", verifyJWT, getMyThreads);
chatRouter.get("/fetchThreadMessages", verifyJWT, fetchThreadMessages);
chatRouter.get("/fetchMessages",fetchMessages)

export default chatRouter