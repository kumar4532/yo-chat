import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (c) => set({ selectedConversation: c }),

	selectedReceiver: null,
	setSelectedReceiver: (u) => set({ selectedReceiver: u }),

	unreadCountByConversation: {},

	incrementUnread: (conversationId) =>
		set((state) => ({
			unreadCountByConversation: {
				...state.unreadCountByConversation,
				[conversationId]:
					(state.unreadCountByConversation[conversationId] || 0) + 1,
			},
		})),

	clearUnread: (conversationId) =>
		set((state) => ({
			unreadCountByConversation: {
				...state.unreadCountByConversation,
				[conversationId]: 0,
			},
		})),

	messagesByConversation: {},

	currentConversations: [],

	setCurrentConversations: (conversations) => set({ currentConversations: conversations }),

	addNewConversation: (conversation) =>
		set((state) => {
			const exists = state.currentConversations.some(
				(c) => c._id === conversation._id
			);

			if (exists) return state;

			return {
				currentConversations: [
					conversation,
					...state.currentConversations,
				],
			};
		}),

	addMessageToConversation: (conversationId, message) =>
		set((state) => ({
			messagesByConversation: {
				...state.messagesByConversation,
				[conversationId]: [
					...(state.messagesByConversation[conversationId] || []),
					message,
				],
			},
		})),

	setConversationMessages: (conversationId, messages) =>
		set((state) => ({
			messagesByConversation: {
				...state.messagesByConversation,
				[conversationId]: messages,
			},
		})),
}));

export default useConversation;