import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

function useListenMessages() {
  const { socket } = useSocketContext();
  const {
    addMessageToConversation,
    addNewConversation,
    selectedConversation,
    incrementUnread
  } = useConversation();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      addMessageToConversation(newMessage.conversationId, newMessage);

      const isChatOpen =
        selectedConversation?._id === newMessage.conversationId;

      if (!isChatOpen) {
        incrementUnread(newMessage.conversationId);
      }
    };

    const handleNewConversation = ({ conversation }) => {
      addNewConversation(conversation);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("newConversation", handleNewConversation);


    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("newConversation", handleNewConversation);
    };
  }, [socket, addMessageToConversation, addNewConversation]);
}

export default useListenMessages;