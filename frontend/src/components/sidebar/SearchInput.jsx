import React, { useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import useGetCoversations from '../../hooks/useGetCoversation';
import useConversation from "../../zustand/useConversation"

function SearchInput({ setSelectedUser }) {
  const [search, setSearch] = useState("")
  const [searchConvos, setSearchConvos] = useState([]);
  const { conversations } = useGetCoversations();
  const { setSelectedConversation } = useConversation();

  useEffect(() => {
    const searchConversations = () => {
      const lowerInput = search.toLowerCase();
      const matchedUsers = conversations.filter(user =>
        user.fullname.toLowerCase().includes(lowerInput)
      );
      setSearchConvos(matchedUsers);
    };

    if (search) {
      searchConversations();
    } else {
      setSearchConvos([]);
    }
  }, [search, conversations])

  const handleStartConvo = (user) => {
    setSelectedConversation(user)
    setSearch("");
    setSelectedUser(user);
  }

  return (
    <div>
      <div className='flex items-center gap-2'>
        <input
          type="text"
          placeholder='Search...'
          className='input input-bordered rounded-full'
          value={search}
          onChange={(e) => setSearch(e.target.value)} />
        <button type='submit' className='btn btn-circle bg-gray-800 text-white'><CiSearch className='w-7 h-7 outline-none' /></button>
      </div>
      {
        search.trim() !== '' && searchConvos.length > 0 && (
          <div className='bg-slate-900 rounded-xl mt-2 text-white w-full'>
            <ul className='p-4'>
              {searchConvos.map((user, idx) => (
                <div key={idx}>
                  <div className='flex flex-row justify-between items-center cursor-pointer' onClick={() => handleStartConvo(user)}>
                    <div className='w-12 rounded-full'>
                      <img src={user.profilePic} alt="user avatar" />
                    </div>
                    <li className="truncate flex-grow">{user.fullname}</li>
                  </div>
                  {idx !== searchConvos.length - 1 && <div className="divider my-2"></div>}
                </div>
              ))}
            </ul>
          </div>
        )
      }
    </div>
  )
}

export default SearchInput;