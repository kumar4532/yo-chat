import { createContext, useContext, useEffect, useState } from 'react';
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
    }, [authUser?._id]);

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

    const rejectCall = () => {
        const id = incomingCall.caller._id

        socket.emit("callRejected", {
            callerId: id
        })
    }

    const acceptCall = () => {
        const id = incomingCall.caller._id

        socket.emit("callAccepted", {
            callerId: id
        })
    }

    return (
        <SocketContext.Provider value={{
            socket,
            onlineUsers,
            makeVoiceCall,
            makeVideoCall,
            incomingCall,
            rejectCall,
            acceptCall
        }}>
            {children}
            <Call />
        </SocketContext.Provider>
    );
};