import { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance';

function useGetAllConversationsOfUser() {
    const [loading, setLoading] = useState(false)
    const [currentConversations, setCurrentConversations] = useState([]);

    useEffect(() => {
        const getAllConversation = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get("/api/messages/");

                if (res.data.error) {
                    throw new Error(res.data.error)
                }

                setCurrentConversations(res.data);
            } catch (error) {
                toast.error(error.message)
            } finally {
                setLoading(false)
            }
        }

        getAllConversation();
    }, [])

    return { loading, currentConversations };
}

export default useGetAllConversationsOfUser