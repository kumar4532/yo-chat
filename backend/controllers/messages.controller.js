import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverUser } = req.params;
        const senderUser = req.user._id;
        const uploadFile = req.file?.path

        if (!message && !uploadFile) {
            return res.status(400).json({ error: "Please provide either a message or a file" });
        }

        let file = "";
        if (uploadFile) {
            file = await uploadOnCloudinary(uploadFile);

            if (!file || !file.url) {
                return res.status(400).json({ error: "File upload failed" });
            }
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderUser, receiverUser] }
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderUser, receiverUser]
            })
        }

        const newMessage = await Message.create({
            conversationId: conversation._id,
            senderId: senderUser,
            receiverId: receiverUser,
            message: message || "",
            file: file?.url || "",
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id)
        }

        await conversation.save();

        const populatedConversation = await Conversation.findById(conversation._id)
            .populate({
                path: "messages",
                select: "_id senderId receiverId message file seenAt createdAt",
            })
            .populate({
                path: "participants",
                select: "_id fullname username profilePic",
            });

        // await newMessage.save();
        const receiverSocketId = getReceiverSocketId(receiverUser);
        if (receiverSocketId) {
            // io.to(<socket_id>).emit() used to send events to specific client
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(200).json({
            newMessage,
            conversation: populatedConversation,
        });


    } catch (error) {
        console.log("Error in sendMessage controller");
        throw error
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: conversationId } = req.params;

        console.log(conversationId)
        const conversation = await Conversation.findById(conversationId)
            .populate("messages");

        if (!conversation) {
            return res.status(404).json({
                conversationId: null,
                messages: [],
            });
        }

        return res.status(200).json({
            conversationId: conversation._id,
            messages: conversation.messages,
        });
    } catch (error) {
        console.log("Error in getMessages controller", error);
        res.status(500).json({ error: "Failed to get messages" });
    }
};


export const getAllConversationsOfUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const allConversations = await Conversation.find({
            participants: userId
        }).populate('participants', '-password').select("-messages");

        res.status(200).json(allConversations);
    } catch (error) {
        console.error("Error in getAllConversationsOfUser controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
}