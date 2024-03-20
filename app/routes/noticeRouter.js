import express from "express";

import { createNotice } from "../controllers/noticeController.js";
const noticeRouter = express.Router();


noticeRouter.post("/creationnotice", createNotice);
export default noticeRouter;