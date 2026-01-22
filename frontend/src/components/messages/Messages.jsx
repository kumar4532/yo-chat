import React, { useRef, useEffect } from 'react';
import Message from './Message';
import Skeleton from '../skeleton/Skeleton';
import useGetMessages from '../../hooks/useGetMessages';
import useListenMessages from '../../hooks/useListenMessages';
import useConversation from '../../zustand/useConversation';

function Messages() {
  const { selectedConversation, messagesByConversation } = useConversation();
  const { loading } = useGetMessages();
  useListenMessages();

  const messages =
    selectedConversation
      ? messagesByConversation[selectedConversation._id] || []
      : [];


  return (
    <div className="px-4 flex-1 overflow-auto">
      {messages?.length > 0 ? (
        messages?.map((message) => (
          <div
            key={message._id}
          >
            <Message message={message} />
          </div>
        ))
      ) : loading ? (
        [...Array(3)].map((_, idx) => <Skeleton key={idx} />)
      ) : (
        <p className="text-center">Send a message to start the conversation</p>
      )}
    </div>
  );
}

export default Messages;