import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    MdOutlineCallEnd,
    MdVideocamOff,
    MdVideocam,
    MdMicOff,
    MdMic
} from "react-icons/md";
import Peer from "simple-peer";
import toast from 'react-hot-toast';

import { useSocketContext } from '../../context/SocketContext';

function Video() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const {
        socket,
        pendingWebrtcSignals,
        clearPendingWebrtcSignals
    } = useSocketContext();

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const streamRef = useRef(null);
    const peerRef = useRef(null);
    const pendingSignalsRef = useRef([]);
    const remoteEndedRef = useRef(false);
    const localEndedRef = useRef(false);

    const [stream, setStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isConnected, setIsConnected] = useState(searchParams.get('mode') !== "outgoing");

    const id = searchParams.get('id');
    const mode = searchParams.get('mode');
    const callAcceptedRef = useRef(mode !== "outgoing");

    const destroyPeer = useCallback(() => {
        if (peerRef.current) {
            peerRef.current.removeAllListeners();
            peerRef.current.destroy();
            peerRef.current = null;
        }
    }, []);

    const stopMediaStream = useCallback(() => {
        const activeStream = streamRef.current;

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }

        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }

        if (activeStream) {
            activeStream.getTracks().forEach((track) => track.stop());
        }

        streamRef.current = null;
        setStream(null);
        setRemoteStream(null);
    }, []);

    const finishCall = useCallback((shouldNotifyRemote) => {
        if (localEndedRef.current) {
            return;
        }

        localEndedRef.current = true;

        if (shouldNotifyRemote && socket && id && !remoteEndedRef.current) {
            socket.emit("callEndedByLocal", { to: id });
        }

        destroyPeer();
        stopMediaStream();
        navigate('/');
    }, [destroyPeer, id, navigate, socket, stopMediaStream]);

    const createPeer = useCallback((localStream, initiator) => {
        if (!socket || !id) {
            return null;
        }

        destroyPeer();

        const iceServers = [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                    "stun:stun3.l.google.com:19302"
                ]
            }
        ];

        const peer = new Peer({
            stream: localStream,
            initiator,
            trickle: true,
            config: { iceServers }
        });

        peer.on('signal', (sdp) => {
            socket.emit('webrtcSignal', {
                to: id,
                sdp,
                type: mode,
            });
        });

        peer.on('stream', (incomingRemoteStream) => {
            setRemoteStream(incomingRemoteStream);
            setIsConnected(true);
        });

        peer.on('connect', () => {
            setIsConnected(true);
        });

        peer.on('close', () => {
            if (!localEndedRef.current) {
                finishCall(false);
            }
        });

        peer.on('error', () => {
            toast.error("Unable to establish video call");
            if (!localEndedRef.current) {
                finishCall(false);
            }
        });

        peerRef.current = peer;

        if (pendingSignalsRef.current.length > 0) {
            const queuedSignals = [...pendingSignalsRef.current];
            pendingSignalsRef.current = [];

            queuedSignals.forEach((queuedSignal) => {
                try {
                    peer.signal(queuedSignal);
                } catch (error) {
                    console.error("Failed to process queued WebRTC signal:", error);
                }
            });
        }

        return peer;
    }, [destroyPeer, finishCall, id, mode, socket]);

    useEffect(() => {
        if (!socket) {
            return undefined;
        }

        const handleDisconnect = () => {
            if (!localEndedRef.current) {
                finishCall(false);
            }
        };

        socket.on("disconnect", handleDisconnect);

        return () => {
            socket.off("disconnect", handleDisconnect);
        };
    }, [finishCall, socket]);

    useEffect(() => {
        if (localVideoRef.current && stream) {
            localVideoRef.current.srcObject = stream;
        }
    }, [stream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    useEffect(() => {
        if (!id || streamRef.current) {
            return undefined;
        }

        let cancelled = false;

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((mediaStream) => {
                if (cancelled) {
                    mediaStream.getTracks().forEach((track) => track.stop());
                    return;
                }

                streamRef.current = mediaStream;
                setStream(mediaStream);
                setIsCameraOn(mediaStream.getVideoTracks()[0]?.enabled ?? false);
                setIsMicOn(mediaStream.getAudioTracks()[0]?.enabled ?? false);

                if (mode === "incoming") {
                    createPeer(mediaStream, false);
                } else if (mode === "outgoing" && callAcceptedRef.current) {
                    createPeer(mediaStream, true);
                }
            })
            .catch((error) => {
                console.error("Error accessing media devices:", error);
                toast.error("Camera or microphone access failed");
                navigate('/');
            });

        return () => {
            cancelled = true;
            destroyPeer();
            stopMediaStream();
        };
    }, [createPeer, destroyPeer, id, mode, navigate, stopMediaStream]);

    useEffect(() => {
        if (!socket || !id) {
            return undefined;
        }

        const handleAccepted = ({ from }) => {
            if (mode !== "outgoing" || from !== id) {
                return;
            }

            callAcceptedRef.current = true;

            if (!streamRef.current || peerRef.current) {
                return;
            }

            createPeer(streamRef.current, true);
        };

        const handleRemoteEnd = ({ from }) => {
            if (from && from !== id) {
                return;
            }

            remoteEndedRef.current = true;
            finishCall(false);
        };

        socket.on("callAcceptedByRemote", handleAccepted);
        socket.on("callRejectedByRemote", handleRemoteEnd);
        socket.on("callEndedByRemote", handleRemoteEnd);

        return () => {
            socket.off("callAcceptedByRemote", handleAccepted);
            socket.off("callRejectedByRemote", handleRemoteEnd);
            socket.off("callEndedByRemote", handleRemoteEnd);
        };
    }, [createPeer, finishCall, id, mode, socket]);

    useEffect(() => {
        if (!id || pendingWebrtcSignals.length === 0) {
            return;
        }

        const matchingSignals = pendingWebrtcSignals.filter(
            ({ from, sdp }) => from === id && Boolean(sdp)
        );

        if (matchingSignals.length === 0) {
            return;
        }

        matchingSignals.forEach(({ sdp }) => {
            if (!peerRef.current) {
                pendingSignalsRef.current.push(sdp);
                return;
            }

            try {
                peerRef.current.signal(sdp);
            } catch (error) {
                console.error("Failed to process WebRTC signal:", error);
            }
        });

        clearPendingWebrtcSignals(matchingSignals);
    }, [clearPendingWebrtcSignals, id, pendingWebrtcSignals]);

    const handleEndCall = useCallback(() => {
        finishCall(true);
    }, [finishCall]);

    const toggleCamera = useCallback(() => {
        const videoTrack = streamRef.current?.getVideoTracks()[0];

        if (!videoTrack) {
            return;
        }

        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
    }, []);

    const toggleMic = useCallback(() => {
        const audioTrack = streamRef.current?.getAudioTracks()[0];

        if (!audioTrack) {
            return;
        }

        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
    }, []);

    return (
        <div className='w-full flex flex-col items-center justify-center h-screen bg-gray-900 text-white'>
            {!id && <div className='mb-4 text-red-300'>Missing call user.</div>}

            <div className="relative w-full max-w-5xl h-[70vh] mb-6 border-4 border-blue-500 rounded-lg overflow-hidden bg-black">
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />

                {!remoteStream && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-lg">
                        {mode === "outgoing" && !isConnected ? "Waiting for receiver..." : "Connecting video..."}
                    </div>
                )}

                <div className="absolute bottom-4 right-4 w-36 h-48 md:w-52 md:h-64 rounded-lg overflow-hidden border-2 border-white/40 bg-gray-800">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover scale-x-[-1]"
                    />
                </div>
            </div>

            <div className="mb-4 text-sm text-gray-300">
                {mode === "outgoing" && !isConnected ? "Calling..." : "In call"}
            </div>

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
