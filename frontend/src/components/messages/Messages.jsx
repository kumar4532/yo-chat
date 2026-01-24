import React, { useEffect, useRef } from "react";
import Message from "./Message";
import Skeleton from "../skeleton/Skeleton";
import useGetMessages from "../../hooks/useGetMessages";
import useConversation from "../../zustand/useConversation";

function Messages() {
  const { selectedConversation, messagesByConversation } = useConversation();
  const { loading } = useGetMessages();
  const bottomRef = useRef(null);

  const messages =
    selectedConversation
      ? messagesByConversation[selectedConversation._id] || []
      : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedConversation]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      {messages.length > 0 ? (
        messages.map((message) => (
          <Message key={message._id} message={message} />
        ))
      ) : loading ? (
        [...Array(3)].map((_, idx) => <Skeleton key={idx} />)
      ) : (
        <p className="text-center">Send a message to start the conversation</p>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default Messages;