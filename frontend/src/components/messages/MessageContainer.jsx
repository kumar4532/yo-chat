import React, { useEffect } from "react";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { TiMessage } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import { FiPhoneCall } from "react-icons/fi";
import { MdOutlineMissedVideoCall } from "react-icons/md";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import { useNavigate } from "react-router-dom";

function MessageContainer() {
  const { authUser } = useAuthContext();
  const { selectedReceiver, selectedConversation } = useConversation();
  const { startVideoCall, startVoiceCall } = useSocketContext();
  const navigate = useNavigate();

  if (!selectedReceiver || !selectedConversation) {
    return <NoChatSelected user={authUser} />;
  }

  const handlePhoneCall = () => {
    startVoiceCall(selectedReceiver._id);
    const query = new URLSearchParams({
      id: selectedReceiver._id,
      name: selectedReceiver.fullname,
      pic: selectedReceiver.profilePic,
      mode: "outgoing",
    });
    navigate(`/voice?${query.toString()}`);
  };

  const handleVideoCall = () => {
    startVideoCall(selectedReceiver._id);
    const query = new URLSearchParams({
      id: selectedReceiver._id,
      name: selectedReceiver.fullname,
      pic: selectedReceiver.profilePic,
      mode: "outgoing",
    });
    navigate(`/video?${query.toString()}`);
  };

  return (
    <div className="w-full flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-200 px-4 py-3 mb-2">
        <span className="font-semibold text-lg text-slate-900">
          To: {selectedReceiver.fullname}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handlePhoneCall}
            className="p-2 bg-green-500 text-white rounded-full"
          >
            <FiPhoneCall />
          </button>
          <button
            onClick={handleVideoCall}
            className="p-2 bg-blue-500 text-white rounded-full"
          >
            <MdOutlineMissedVideoCall />
          </button>
        </div>
      </div>

      <Messages />
      <MessageInput />
    </div>
  );
}

function NoChatSelected({ user }) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="text-center text-gray-200 flex flex-col gap-2">
        <p>Welcome 👋 {user.fullname}</p>
        <p>Select a chat to start messaging</p>
        <TiMessage className="text-4xl mx-auto" />
      </div>
    </div>
  );
}

export default MessageContainer;
