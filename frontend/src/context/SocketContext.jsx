import React, { createContext, useContext, useEffect, useState } from 'react';
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
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
            const socket = io("http://localhost:8000", {
                query: {
                    userId: authUser._id
                }
            });

            setSocket(socket);

            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            socket.on("incomingVideoCall", (data) => {
                setIncomingCall({ ...data, type: 'video' });
            });

            socket.on("incomingVoiceCall", (data) => {
                setIncomingCall({ ...data, type: 'voice' });
            });

            return () => socket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);

    const makeVoiceCall = (remoteId) => {
        const localId = authUser._id;

        if (socket) {
            socket.emit("outGoingVoiceCall", {
                caller: localId,
                reciever: remoteId
            });
        }
    }

    const makeVideoCall = (remoteId) => {
        const localId = authUser._id;

        if (socket) {
            socket.emit("outGoingVideoCall", {
                caller: localId,
                reciever: remoteId
            });
        }
    }

    return (
        <SocketContext.Provider value={{
            socket,
            onlineUsers,
            makeVoiceCall,
            makeVideoCall,
            incomingCall
            // rejectCall
        }}>
            {children}
            <Call />
        </SocketContext.Provider>
    );
};