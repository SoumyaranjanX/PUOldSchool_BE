
import express from "express";

import {createMessage,fetchMessages} from "../controllers/chatControoler.js"

const chatRouter = express.Router();
chatRouter.post("/message", createMessage);
chatRouter.get("/fetchMessages",fetchMessages)

export default chatRouter