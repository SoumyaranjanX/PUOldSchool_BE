import app from "./server.js";
import { Server } from "socket.io";
import http from "http"
import cors from "cors"

const socketServer = http.createServer(app)
const port = process.env.SOCKETPORT || 8001;
const io = new Server(socketServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

socketServer.listen(port, () => {
    console.log(`Socket Server Started at: http://localhost:${port}`)
})
