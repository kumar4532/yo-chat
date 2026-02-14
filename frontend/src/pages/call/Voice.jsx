import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MdOutlineCallEnd } from "react-icons/md";
import { useSocketContext } from '../../context/SocketContext';

function Voice() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { socket } = useSocketContext();

    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const pic = searchParams.get('pic');
    const mode = searchParams.get('mode');
    const [isConnected, setIsConnected] = useState(mode !== "outgoing");

    if (!id) {
        return <div>Error: Missing conversation data</div>;
    }

    const handleRemoteEnd = useCallback(() => {
        navigate('/');
    }, [navigate]);

    const handleEndCall = useCallback(() => {
        if (socket) {
            socket.emit("callEndedByLocal", {
                to: id
            });
        }
        navigate('/');
    }, [socket, id, navigate]);

    useEffect(() => {
        if (!socket) return;

        const handleAccepted = ({ from }) => {
            if (!id || from === id) {
                setIsConnected(true);
            }
        };

        socket.on("callAcceptedByRemote", handleAccepted);
        socket.on("callRejectedByRemote", handleRemoteEnd);
        socket.on("callEndedByRemote", handleRemoteEnd);

        return () => {
            socket.off("callAcceptedByRemote", handleAccepted);
            socket.off("callRejectedByRemote", handleRemoteEnd);
            socket.off("callEndedByRemote", handleRemoteEnd);
        };
    }, [socket, id, handleRemoteEnd]);

    return (
        <div className='flex flex-col text-2xl justify-center items-center h-screen'>
            {pic && (
                <div className="w-40 h-40 md:w-56 md:h-56 mb-4">
                    <img
                        src={pic}
                        alt={`${name || "User"}'s profile`}
                        className="w-full h-full object-cover rounded-full ring-4 ring-blue-500 ring-offset-4"
                    />
                </div>
            )}
            <div className='mb-2 font-semibold text-gray-800'>
                {name || "Voice Call"}
            </div>
            <div className='mb-6 text-base text-gray-600'>
                {mode === "outgoing" && !isConnected ? "Calling..." : "In call"}
            </div>
            <button
                onClick={handleEndCall}
                className='text-4xl p-4 bg-red-600 hover:bg-red-700 rounded-full text-white transition duration-300 ease-in-out transform hover:scale-110'
                aria-label="End call"
            >
                <MdOutlineCallEnd />
            </button>
        </div>
    );
}

export default Voice;
