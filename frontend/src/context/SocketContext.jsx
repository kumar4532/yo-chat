import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import Call from '../components/alert/Call';

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [incomingCall, setIncomingCall] = useState(null);
    const [pendingWebrtcSignals, setPendingWebrtcSignals] = useState([]);
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
            const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

            if (!authUser?._id) return;

            const socket = io(SOCKET_URL, {
                query: {
                    userId: authUser._id.toString(),
                },
                withCredentials: true,
            });

            setSocket(socket);

            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            socket.on("incomingCall", (data) => {
                setIncomingCall(data);
            });

            socket.on("callEndedByRemote", () => {
                setIncomingCall(null);
            });

            socket.on("webrtcSignal", (signal) => {
                setPendingWebrtcSignals((currentSignals) => [...currentSignals, signal]);
            });

            return () => socket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser?._id]);

    const clearPendingWebrtcSignals = useCallback((signalsToClear) => {
        if (!Array.isArray(signalsToClear) || signalsToClear.length === 0) return;

        setPendingWebrtcSignals((currentSignals) =>
            currentSignals.filter((signal) => !signalsToClear.includes(signal))
        );
    }, []);

    const startVoiceCall = (remoteId) => {
        const localId = authUser._id;

        if (socket) {
            socket.emit("startCall", {
                callerId: localId,
                receiverId: remoteId,
                type: "voice",
            });
        }
    }

    const startVideoCall = (remoteId) => {
        const localId = authUser._id;

        if (socket) {
            socket.emit("startCall", {
                callerId: localId,
                receiverId: remoteId,
                type: "video",
            });
        }
    }

    const rejectCall = () => {
        if (!socket || !incomingCall?.caller?._id) return;
        const id = incomingCall.caller._id;

        socket.emit("callRejectedByLocal", {
            to: id,
            type: incomingCall.type
        });
        setIncomingCall(null);
    }

    const acceptCall = () => {
        if (!socket || !incomingCall?.caller?._id) return;
        const id = incomingCall.caller._id;

        socket.emit("callAcceptedByLocal", {
            to: id,
            type: incomingCall.type
        });
    }

    const clearIncomingCall = () => {
        setIncomingCall(null);
    }

    return (
        <SocketContext.Provider value={{
            socket,
            onlineUsers,
            startVoiceCall,
            startVideoCall,
            incomingCall,
            pendingWebrtcSignals,
            rejectCall,
            acceptCall,
            clearIncomingCall,
            clearPendingWebrtcSignals
        }}>
            {children}
            <Call />
        </SocketContext.Provider>
    );
};
