import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import useConversation from "../zustand/useConversation";

function useGetAllConversationsOfUser() {
    const {
        currentConversations = [],
        setCurrentConversations,
    } = useConversation();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchConversations = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get("/messages/");
                setCurrentConversations(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [currentConversations.length]);

    return { currentConversations, loading };
}

export default useGetAllConversationsOfUser;
