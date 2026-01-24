import React from 'react'
import { useAuthContext } from "../../context/AuthContext"
import useConversation from '../../zustand/useConversation'
import { FileText } from "lucide-react"

function Message({ message }) {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();

  const me = selectedConversation?.participants.find((user) => user?._id === authUser?._id)
  const otherPerson = selectedConversation?.participants.find((user) => user?._id !== authUser?._id)

  const fromMe = authUser._id === message.senderId;
  const chatClass = fromMe ? "chat-end" : "chat-start";
  const bgClr = fromMe ? "bg-blue-500" : null;
  const myProfilePic = fromMe ? me.profilePic : otherPerson?.profilePic;
  const shakeClass = message.shouldShake ? "shake" : "";

  const messageTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const isImage = (fileUrl) => {
    const extension = fileUrl.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
  };

  const getFileName = (fileUrl) => {
    return fileUrl.split('/').pop();
  };

  const renderFileContent = (fileUrl) => {
    if (isImage(fileUrl)) {
      return (<div className={`w-1/2 ${fromMe ? "ml-auto" : "mr-auto"}`}>
        <img src={fileUrl} alt="Shared image" className="border border-slate-100 rounded-md w-full" />
      </div>)
    } else {
      const fileName = getFileName(fileUrl);
      return (
        <div className={`flex items-center space-x-3 p-3 rounded-lg ${bgClr}`}>
          <div className="flex-shrink-0">
            <FileText size={40} />
          </div>
          <div className="flex-grow">
            <div className="font-semibold">{fileName}</div>
            <div className="text-sm opacity-75">PDF</div>
          </div>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition-colors"
          >
            Open
          </a>
        </div>
      );
    }
  };

  return (
    <div className={`chat ${chatClass} mb-1`}>
      {(message.message || message.file) && (
        <>
          <div className='chat-image avatar'>
            <div className='w-10 rounded-full'>
              <img src={myProfilePic} alt="profilePic" />
            </div>
          </div>

          <div className={`flex flex-col ${fromMe ? "mr-1 items-end" : "ml-1 items-start"}`}>
            {message.file && (
              <div className={`mb-2`}>
                {renderFileContent(message.file)}
              </div>
            )}

            {message.message && (
              <div className={`chat-bubble text-white ${fromMe ? "mr-1" : "ml-1"} ${bgClr} ${shakeClass} mb-1`}>
                {message.message}
              </div>
            )}
          </div>

          <div className='chat-footer opacity-60 text-red-100 text-xs flex gap-1 items-center mb-2'>
            {messageTime}
            {/* {fromMe && (
              <div className="chat-footer">
                {message.seenAt ? "Seen" : "Delivered"}
              </div>
            )} */}
          </div>
        </>
      )}
    </div>
  )
}

export default Message;