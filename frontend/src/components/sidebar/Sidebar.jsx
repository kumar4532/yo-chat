import React from "react";
import SearchInput from "./SearchInput";
import Conversation from "./Conversation";
import Logout_Btn from "./Logout_Btn";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import useConversation from "../../zustand/useConversation";

function Sidebar() {
  const navigate = useNavigate();
  const { setSelectedReceiver, setSelectedConversation } = useConversation();

  const handleConversationClick = (user) => {
    setSelectedReceiver(user);
    setSelectedConversation(null);
  };

  return (
    <div className="w-full border-r border-slate-500 p-4 flex flex-col h-full">
      <SearchInput onSelectUser={handleConversationClick} />

      <div className="divider px-3"></div>

      <Conversation />

      <div className="flex flex-row justify-between mt-auto">
        <Logout_Btn />
        <button
          className="tooltip text-2xl hover:bg-slate-600 rounded-full p-2"
          data-tip="Profile"
          onClick={() => navigate("/profile")}
        >
          <CgProfile className="text-white" />
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
