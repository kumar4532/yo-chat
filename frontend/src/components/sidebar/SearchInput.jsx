import React, { useEffect, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import useGetCoversations from '../../hooks/useGetCoversation';
import useConversation from '../../zustand/useConversation';

function SearchInput() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { conversations } = useGetCoversations();
  const { setSelectedReceiver, setSelectedConversation } = useConversation();

  useEffect(() => {
    if (!search) {
      setSearchResults([]);
      return;
    }

    const lowerInput = search.toLowerCase();

    const matchedUsers = conversations.filter(user =>
      user.fullname.toLowerCase().includes(lowerInput)
    );

    setSearchResults(matchedUsers);
  }, [search, conversations]);

  const handleStartConvo = (user) => {
    setSelectedReceiver(user);
    setSelectedConversation(user);
    setSearch("");
  };


  return (
    <div>
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search..."
          className="input input-bordered rounded-full w-full pr-12"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
        >
          <CiSearch className="w-6 h-6" />
        </button>
      </div>

      {search.trim() !== '' && searchResults.length > 0 && (
        <div className='bg-slate-900 rounded-xl mt-2 text-white w-full'>
          <ul className='p-4'>
            {searchResults.map((user, idx) => (
              <li
                key={user._id}
                className='flex flex-row justify-between items-center cursor-pointer py-1 border border-red-500 mb-1'
                onClick={() => handleStartConvo(user)}
              >
                <div className='w-12 rounded-full'>
                  <img src={user.profilePic} alt="user avatar" />
                </div>
                <span className="truncate flex-grow ml-2">{user.fullname}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchInput;