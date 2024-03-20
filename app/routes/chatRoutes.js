
import express from "express";

import {createMessage} from "../controllers/chatControoler.js"

const chatRouter = express.Router();
chatRouter.post("/message", createMessage);

export default chatRouter