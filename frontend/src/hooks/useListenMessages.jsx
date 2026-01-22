import React, { useEffect } from 'react'
import { useSocketContext } from "../context/SocketContext"
import useConversation from "../zustand/useConversation"

function useListenMessages() {
  const { socket } = useSocketContext();
  const { addMessageToConversation } = useConversation();

  useEffect(() => {
    if (!socket) return;

    const handler = (newMessage) => {
      addMessageToConversation(newMessage.conversationId, newMessage);
    };

    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [socket, addMessageToConversation]);
}


export default useListenMessages