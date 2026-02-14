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

    const emitToUser = (targetUserId, event, payload = {}) => {
        if (!targetUserId) return;
        const remoteSocketId = userSocketMap[targetUserId.toString()];
        if (remoteSocketId) {
            io.to(remoteSocketId).emit(event, payload);
        }
    };

    socket.on("startCall", async ({ callerId, receiverId, type }) => {
        const normalizedReceiverId = receiverId?.toString();
        const remoteSocketId = userSocketMap[normalizedReceiverId];

        if (remoteSocketId) {
            const localCaller = await User.findById(callerId);
            if (!localCaller) return;

            io.to(remoteSocketId).emit("incomingCall", {
                caller: localCaller,
                callerId: callerId?.toString(),
                type,
            });
            return;
        }

        emitToUser(callerId, "callUnavailable", {
            receiverId: normalizedReceiverId,
            type,
        });
    });

    socket.on("callAcceptedByLocal", ({ to, type }) => {
        emitToUser(to, "callAcceptedByRemote", {
            from: normalizedUserId,
            type,
        });
    });

    socket.on("callRejectedByLocal", ({ to, type }) => {
        emitToUser(to, "callRejectedByRemote", {
            from: normalizedUserId,
            type,
        });
    });

    socket.on("callEndedByLocal", ({ to }) => {
        emitToUser(to, "callEndedByRemote", {
            from: normalizedUserId,
        });
    });

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[normalizedUserId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
