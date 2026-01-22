import React, { useState, useEffect, useRef } from 'react'
import { BsSend } from 'react-icons/bs'
import useSendMessage from '../../hooks/useSendMessage'
import { MdEmojiEmotions } from "react-icons/md";
import { IoDocumentAttach } from "react-icons/io5";
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"

function MessageInput() {
  const emojiRef = useRef(null);
  const { loading, sendMessage } = useSendMessage();
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target)
      ) {
        setShowEmojis(false);
      }
    };

    if (showEmojis) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojis]);


  const handleUploadFile = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setUploadFile(file);
  };

  const handleShowEmoji = (e) => {
    e.preventDefault();
    setShowEmojis(!showEmojis);
  }

  const addEmoji = (e) => {
    const sym = e.unified.split("_");
    const emojiArray = sym.map(el => parseInt("0x" + el, 16));
    const emoji = String.fromCodePoint(...emojiArray);
    setMessage(prevMessage => prevMessage + emoji);
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message && !uploadFile) return;

    await sendMessage(message, uploadFile);
    setMessage('');
    setUploadFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <>
      <div>
        {showEmojis && (
          <div ref={emojiRef} className="absolute bottom-14 left-4 z-50">
            <Picker
              data={data}
              emojiSize={20}
              emojiButtonSize={30}
              onEmojiSelect={addEmoji}
            />
          </div>
        )}
      </div>

      {uploadFile && (
        <div className="px-4 py-2 text-base bg-slate-500 w-2/3 mx-auto rounded-md text-gray-200 flex justify-between items-center">
          <span>File selected: {uploadFile.name}</span>
          <button onClick={() => setUploadFile(null)} className="text-red-500 hover:text-red-700">Remove</button>
        </div>
      )}

      <form className='px-4 my-3 flex flex-row' onSubmit={handleSendMessage}>
        <div className='flex flex-row text-xl'>
          <button className='mr-2' type='button' onClick={handleUploadFile}>
            <IoDocumentAttach />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button className='mr-2' type='button' onClick={handleShowEmoji}>
            <MdEmojiEmotions />
          </button>
        </div>
        <div className='w-full relative'>
          <input
            type="text"
            className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white'
            placeholder='Send a message...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type='submit' disabled={!message.trim() && !uploadFile} className='absolute inset-y-0 end-0 flex items-center pe-3'>
            {loading ? <span className='loading loading-spinner'></span> : <BsSend />}
          </button>
        </div>
      </form>
    </>
  )
}

export default MessageInput