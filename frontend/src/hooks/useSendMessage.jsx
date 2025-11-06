import React, { useState } from 'react'
import useConversation from '../zustand/useConversation'
import toast from "react-hot-toast"
import axiosInstance from '../api/axiosInstance'

function useSendMessage() {
  const { messages, setMessages, selectedConversation } = useConversation()
  const [loading, setLoading] = useState(false)

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    const maxSize = 2 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only images (JPEG, PNG, GIF) and PDF files are allowed.');
    }

    if (file.size > maxSize) {
      throw new Error('File size exceeds 2MB limit.');
    }
  }

  const sendMessage = async (message, file) => {

    if (!message && !file) {
      toast.error('Please provide a message or select a file.');
      return;
    }

    const formData = new FormData();

    if (file) {
      try {
        validateFile(file);
        formData.append("file", file);
      } catch (error) {
        toast.error(error.message);
        return;
      }
    }

    if (message) {
      formData.append("message", message);
    }

    setLoading(true)
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedConversation._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = res.data;

      if (data.error) {
        throw new error
      }

      setMessages([...messages, data.newMessage])
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }
  return { loading, sendMessage }
}

export default useSendMessage