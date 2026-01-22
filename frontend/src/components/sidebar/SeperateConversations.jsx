import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import useGetAllConversationsOfUser from "../../hooks/useGetAllConversationsOfUser";

function SeperateConversations({ receiver, lastIdx }) {
    const { selectedReceiver, setSelectedReceiver, setSelectedConversation } = useConversation();
    const { onlineUsers } = useSocketContext();
    const { currentConversations } = useGetAllConversationsOfUser();

    const isSelected = selectedReceiver?._id === receiver._id;
    const isOnline = onlineUsers.includes(receiver._id);

    const handleClick = () => {
        setSelectedReceiver(receiver);

        const conversation = currentConversations.find((c) =>
            c.participants.some((u) => u._id === receiver._id)
        );

        setSelectedConversation(conversation || null);
    };

    return (
        <>
            <div
                className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 cursor-pointer
        ${isSelected ? "bg-sky-400" : ""}`}
                onClick={handleClick}
            >
                <div className={`avatar ${isOnline ? "online" : ""}`}>
                    <div className="w-12 rounded-full">
                        <img src={receiver.profilePic} alt="user avatar" />
                    </div>
                </div>

                <div className="flex flex-col flex-1">
                    <p className="font-bold text-gray-200">
                        {receiver.fullname}
                    </p>
                </div>
            </div>

            {!lastIdx && <div className="divider my-0 py-0 h-1" />}
        </>
    );
}

export default SeperateConversations;