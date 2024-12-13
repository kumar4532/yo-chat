import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import Messages from './Messages'
import MessageInput from './MessageInput'
import { TiMessage } from 'react-icons/ti'
import useConversation from "../../zustand/useConversation"
import { useAuthContext } from "../../context/AuthContext"
import { FiPhoneCall } from "react-icons/fi"
import { MdOutlineMissedVideoCall } from "react-icons/md"
import { useSocketContext } from '../../context/SocketContext'

function MessageContainer() {
  const { authUser } = useAuthContext()
  const { selectedConversation, setSelectedConversation } = useConversation()
  const { makeVideoCall, makeVoiceCall } = useSocketContext()
  const navigate = useNavigate()

  useEffect(() => {
    return () => setSelectedConversation(null)
  }, [setSelectedConversation])

  const handlePhoneCall = () => {
    const { _id, fullname, profilePic } = selectedConversation;

    const params = new URLSearchParams({
      id: _id,
      name: fullname,
      pic: profilePic
    });

    makeVoiceCall(_id);
    navigate(`/voice?${params.toString()}`);
  }
  
  const handleVideoCall = () => {
    const { _id, fullname, profilePic } = selectedConversation;

    const params = new URLSearchParams({
      id: _id,
      name: fullname,
      pic: profilePic
    });

    makeVideoCall(_id);
    navigate(`/video?${params.toString()}`);
  }

  return (
    <div className='w-full flex flex-col h-full'>
      {!selectedConversation ? (
        <NoChatSelected user={authUser} />
      ) : (
        <>
          <div className='flex justify-between bg-slate-200 px-4 py-2 mb-2'>
            <span className='font-semibold text-slate-900 text-base'>To: {selectedConversation.fullname}</span>
            <div className='flex flex-row justify-center items-center'>
              <button 
                className='mr-1 p-1.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 ease-in-out'
                onClick={handlePhoneCall}
              >
                <FiPhoneCall className="text-xl" />
              </button>
              <button 
                className='ml-1 p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out'
                onClick={handleVideoCall}
              >
                <MdOutlineMissedVideoCall className="text-2xl" />
              </button>
            </div>
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  )
}

function NoChatSelected({ user }) {
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
        <p>Welcome 👋 {user.fullname} </p>
        <p>Select a chat to start messaging</p>
        <TiMessage className='text-3xl md:text-6xl text-center' />
      </div>
    </div>
  )
}

export default MessageContainer