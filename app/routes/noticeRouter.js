import express from "express";

import { createNotice, getNotice, deleteNotice } from "../controllers/noticeController.js";
const noticeRouter = express.Router();
import multer from "multer";

const upload = multer({
    dest: 'temp/',
});

noticeRouter.post("/creationnotice", upload.single('image'), createNotice);
noticeRouter.get("/getnotice", getNotice);
noticeRouter.delete('/deletenotice/:id', deleteNotice);
export default noticeRouter;