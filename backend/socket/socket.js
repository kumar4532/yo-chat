import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "https://yochat.vercel.app",
            "http://localhost:5173"
        ],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId?.toString()];
};

const userSocketMap = {};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId) {
        console.log("Socket connected without userId:", socket.id);
        return;
    }

    const normalizedUserId = userId.toString();
    userSocketMap[normalizedUserId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("outGoingVoiceCall", async ({ caller, reciever }) => {
        const remoteSocketId = userSocketMap[reciever]

        if (remoteSocketId) {
            const localCaller = await User.findById(caller)

            io.to(remoteSocketId).emit("incomingVoiceCall", {
                caller: localCaller,
                callerSocketId: socket.id
            })
        }
    })

    socket.on("outGoingVideoCall", async ({ caller, reciever }) => {
        const remoteSocketId = userSocketMap[reciever]

        if (remoteSocketId) {
            const localCaller = await User.findById(caller)

            io.to(remoteSocketId).emit("incomingVideoCall", {
                caller: localCaller,
                callerSocketId: socket.id
            })
        }
    })

    socket.on("callHasBeenCut", ({ receiver }) => {
        const receiverSocketId = userSocketMap[receiver];

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("callCutByCaller");
        }
    });

    socket.on("callRejected", ({ callerId }) => {
        const callSocketId = userSocketMap[callerId]

        if (callSocketId) {
            io.to(callSocketId).emit("callRejectedByReciever");
        }
    })

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[normalizedUserId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };