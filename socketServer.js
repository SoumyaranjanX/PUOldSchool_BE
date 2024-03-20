import app from "./server.js";
import { Server } from "socket.io";
import http from "http"
import cors from "cors"
import {socketRouter} from "./app/config/routes.js"

const socketServer = http.createServer(app)
const port = process.env.SOCKETPORT || 8001;
const io = new Server(socketServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
})

app.use("/api/v1",socketRouter)

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`)

    socket.on("send_message", (data) => {
        console.log(data)
        socket.broadcast.emit("receive_message", data)
    })
})

socketServer.listen(port, "0.0.0.0", () => {
    console.log(`Socket Server Started at: http://localhost:${port}`)
})
