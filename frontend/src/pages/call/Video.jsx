import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MdOutlineCallEnd, MdVideocamOff, MdVideocam, MdMicOff, MdMic } from "react-icons/md";
import { useSocketContext } from '../../context/SocketContext';

function Video() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { socket } = useSocketContext();
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);

    const id = searchParams.get('id');

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((mediaStream) => {
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            })
            .catch((error) => {
                console.error("Error accessing media devices:", error);
            });

        socket.on("callRejectedByReciever", handleEndCall);

        return () => {
            socket.off("callRejectedByReciever", handleEndCall);
            stopMediaStream();
        };
    }, [socket]);

    const stopMediaStream = () => {
        if (stream) {
            for (const track of stream.getTracks()) {
                track.stop();
            }
            videoRef.current.srcObject = null;
            setStream(null);
        }
    };

    const handleEndCall = () => {
        socket.emit("callHasBeenCut", { receiver: id });
        stopMediaStream();
        // Small delay to ensure cleanup completes before navigation
        setTimeout(() => {
            navigate('/');
        }, 100);
    };

    const toggleCamera = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsCameraOn(videoTrack.enabled);
            }
        }
    };

    const toggleMic = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMicOn(audioTrack.enabled);
            }
        }
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen bg-gray-900 text-white'>
            <div className="relative w-72 h-72 md:w-96 md:h-96 mb-6 border-4 border-blue-500 rounded-lg overflow-hidden">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />
            </div>
            {/* Controls */}
            <div className="flex gap-4">
                <button
                    onClick={toggleCamera}
                    className={`text-3xl p-4 rounded-full transition duration-300 ease-in-out transform hover:scale-110 ${isCameraOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
                    aria-label="Toggle Camera"
                >
                    {isCameraOn ? <MdVideocam /> : <MdVideocamOff />}
                </button>

                <button
                    onClick={toggleMic}
                    className={`text-3xl p-4 rounded-full transition duration-300 ease-in-out transform hover:scale-110 ${isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
                    aria-label="Toggle Microphone"
                >
                    {isMicOn ? <MdMic /> : <MdMicOff />}
                </button>

                <button
                    onClick={handleEndCall}
                    className='text-3xl p-4 bg-red-600 hover:bg-red-700 rounded-full transition duration-300 ease-in-out transform hover:scale-110'
                    aria-label="End Call"
                >
                    <MdOutlineCallEnd />
                </button>
            </div>
        </div>
    );
}

export default Video;