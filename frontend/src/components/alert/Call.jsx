import React, { useEffect, useState } from 'react'
import { useSocketContext } from '../../context/SocketContext'

const Call = () => {
  const { incomingCall, socket } = useSocketContext();
  const [isCallerCalling, setIsCallerCalling] = useState(true)

  useEffect(() => {
    if (incomingCall) {
      setIsCallerCalling(true);
    }
  }, [incomingCall]);
  
  useEffect(() => {
    if (socket) {
      socket.on("callCutByCaller", () => {
        setIsCallerCalling(false);
      });

      return () => {
        socket.off("callCutByCaller");
      };
    }
  }, [socket])
  
  const handleReject = () =>{
    const caller = incomingCall.caller._id
  }
    
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
                <button className="btn btn-sm btn-primary">Accept</button>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}

export default Call