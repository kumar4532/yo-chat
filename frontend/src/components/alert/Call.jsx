import React, { useEffect, useState } from 'react'
import { useSocketContext } from '../../context/SocketContext'
import { useNavigate } from 'react-router-dom';

const Call = () => {
  const { incomingCall, socket, rejectCall, acceptCall, clearIncomingCall } = useSocketContext();
  const [isCallerCalling, setIsCallerCalling] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (incomingCall) {
      setIsCallerCalling(true);
    }
  }, [incomingCall]);

  useEffect(() => {
    if (!socket) return;

    const handleRemoteCut = () => {
      setIsCallerCalling(false);
      clearIncomingCall();
    };

    socket.on("callEndedByRemote", handleRemoteCut);

    return () => {
      socket.off("callEndedByRemote", handleRemoteCut);
    };
  }, [socket, clearIncomingCall]);

  const handleReject = () => {
    rejectCall();
    setIsCallerCalling(false);
  };

  const handleAccept = () => {
    if (!incomingCall?.caller?._id) return;
    acceptCall();

    const query = new URLSearchParams({
      id: incomingCall.caller._id,
      name: incomingCall.caller.fullname || "",
      pic: incomingCall.caller.profilePic || "",
      mode: "incoming",
    });

    const route = incomingCall.type === "video" ? "video" : "voice";
    navigate(`/${route}?${query.toString()}`);
    clearIncomingCall();
  };

  return (
    <>
      {
        incomingCall && isCallerCalling && (
          <div className='absolute top-10 left-[45%]'>
            <div role="alert" className="alert">
              <div className='chat-image avatar'>
                <div className='w-16 rounded-full'>
                  <img src={incomingCall?.caller.profilePic} alt="tailwind css chat bubble component" />
                </div>
              </div>
              <span>{incomingCall?.caller.fullname} is calling.</span>
              <div className='space-x-4'>
                <button className="btn btn-sm" onClick={handleReject}>Deny</button>
                <button className="btn btn-sm btn-primary" onClick={handleAccept}>Accept</button>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}

export default Call
