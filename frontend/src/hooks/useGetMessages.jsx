import React, { useEffect, useState } from 'react';
import useConversation from "../zustand/useConversation";
import axiosInstance from '../api/axiosInstance';

function useGetMessages() {
    const { selectedConversation, setConversationMessages } = useConversation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedConversation) return;
        const fetchMessages = async () => {
            setLoading(true);
            try {

                const res = await axiosInstance.get(
                    `/messages/${selectedConversation._id}`
                );

                const { conversationId, messages } = res.data;
                if (conversationId) {
                    setConversationMessages(conversationId, messages);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [selectedConversation]);

    return { loading };
}

export default useGetMessages;
