import React, { useEffect, useState } from 'react';
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import axiosInstance from '../api/axiosInstance';

function useGetMessages() {
    const { messages, setMessages, selectedConversation } = useConversation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getMessage = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/messages/${selectedConversation._id}`);
                const data = res.data;
                if (data.error) throw new Error(data.error);
                setMessages(data.messages || []);
            } catch (error) {
                toast.error(error.message);
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };

        if (selectedConversation?._id) {
            getMessage();
        } else {
            setMessages([]);
        }

    }, [selectedConversation?._id, setMessages]);

    return { loading, messages };
}

export default useGetMessages;
