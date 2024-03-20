import express from 'express';
import dbConnect from './app/utils/dbConnect.js';
import { router } from './app/config/routes.js';
import dotenv from "dotenv";
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from "./app/errorHander/ApiError.js"
import { fileURLToPath } from 'url';
import path from "path";
import cors from "cors"
import http from "http"
import { Server } from "socket.io";
import { createMessage } from "./app/controllers/chatControoler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, './.env')
})

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use (cors ())
app.use('/public', express.static(path.join(__dirname, 'public')));
const port = process.env.PORT || 8000;

app.get('/ping', (req, res) => {
    res.send("I am Live");
});
app.use("/api", router);

dbConnect();

app.use(errorMiddleware);

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
})

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`)

    socket.on("send_message", (data) => {
        console.log(data)
        createMessage(data)
        socket.broadcast.emit("receive_message", data)
    })
})

server.listen(port, "0.0.0.0", () => {
    console.log(`Socket Server Started at: http://localhost:${port}`)
})

