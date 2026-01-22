import SeperateConversations from "./SeperateConversations";
import useGetAllConversationsOfUser from "../../hooks/useGetAllConversationsOfUser";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";

function Conversation() {
  const { authUser } = useAuthContext();
  const { selectedReceiver } = useConversation();
  const { currentConversations = [], loading } = useGetAllConversationsOfUser();

  let users = currentConversations
    .map((conversation) =>
      conversation.participants?.find(
        (user) => user._id !== authUser._id
      )
    )
    .filter(Boolean);

  if (selectedReceiver) {
    const isAlreadyInList = users.some(u => u._id === selectedReceiver._id);

    if (!isAlreadyInList) {
      users = [selectedReceiver, ...users];
    }
  }

  return (
    <div className="py-2 flex flex-col overflow-auto">
      {users.map((user, idx) => (
        <SeperateConversations
          key={user._id}
          receiver={user}
          lastIdx={idx === users.length - 1}
        />
      ))}

      {loading && (
        <span className="loading loading-spinner mx-auto" />
      )}
    </div>
  );
}

export default Conversation;