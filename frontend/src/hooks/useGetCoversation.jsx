import React, { useEffect, useState } from 'react'
import toast from "react-hot-toast"
import axiosInstance from '../api/axiosInstance';

function useGetCoversations() {
  const [loading, setLoading] = useState(false)
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversation = async() => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/users/");
            const data = res.data;

            if (data.error) {
                throw new Error(data.error)
            }
            setConversations(data.users);
        } catch (error) {
            toast.error(error.message)
        } finally{
            setLoading(false)
        }
    }

    getConversation();
  }, [])

  return {loading, conversations};
}

export default useGetCoversations;