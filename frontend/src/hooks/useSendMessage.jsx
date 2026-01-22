import React, { useState, useEffect } from 'react'
import useConversation from '../zustand/useConversation'
import toast from "react-hot-toast"
import axiosInstance from '../api/axiosInstance'

function useSendMessage() {
  const {
    setSelectedConversation,
    addMessageToConversation,
    selectedReceiver,
    addNewConversation
  } = useConversation();

  const [loading, setLoading] = useState(false);

  const sendMessage = async (message, file) => {
    if (!message && !file) {
      toast.error("Please provide a message or select a file.");
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

    setLoading(true);
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedReceiver._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { conversation, newMessage } = res.data;

      setSelectedConversation(conversation);
      addMessageToConversation(conversation._id, newMessage);
      addNewConversation(conversation);

    } catch (error) {
      toast.error(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMessage };
}

export default useSendMessage


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