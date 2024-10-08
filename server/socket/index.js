const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const http = require("http");
const getUserDetailsFromToken = require("./../helpers/getUserDetailsFromToken");
const userModel = require("../models/userModel");
const {
  conversationModel,
  messageModel,
} = require("../models/conversationModel");
const getConversation = require('./../helpers/getConversation')

const app = express();

// Socket connection
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// server running at http://localhost:8000

// online user
const onlineUser = new Set();

io.on("connection", async (socket) => {
  // console.log('User connected', socket.id);

  const token = socket.handshake.auth.token;
  // console.log("token", token);

  // current user details
  const user = await getUserDetailsFromToken(token);
  // console.log("user", user);

  // create a room
  socket.join(user?._id.toString());
  onlineUser.add(user?._id?.toString());

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    // console.log('userId', userId);
    const userDetails = await userModel.findById(userId).select("-password");

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: onlineUser.has(userId),
    };

    socket.emit("message-user", payload);

    // get previous message
    const getConversationMessage = await conversationModel
      .findOne({
        $or: [
          { sender: user?._id, receiver: userId },
          { sender: userId, receiver: user?._id },
        ],
      })
      .populate("message")
      .sort({ updatedAt: -1 });

    // console.log("getConversation ", getConversationMessage);

    socket.emit("message", getConversationMessage?.message || []);
  });

  // new message
  socket.on("new message", async (data) => {
    // check conversation is available for both user

    let conversation = await conversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });

    //   console.log("new message" , data);
    //   console.log("converstaion ", conversation);

    //if conversation is not available
    if (!conversation) {
      const createConversation = await conversationModel({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation.save();
      // console.log("converstaion ", conversation);
    }

    const message = new messageModel({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      msgByUserId: data?.msgByUserId,
    });

    const saveMessage = await message.save();

    const updateConversation = await conversationModel.updateOne(
      { _id: conversation?._id },
      {
        $push: { message: saveMessage?._id },
      }
    );

    const getConversationMessage = await conversationModel
      .findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      })
      .populate("message")
      .sort({ updatedAt: -1 });

    // console.log("getConversation ", getConversationMessage);

    io.to(data?.sender).emit("message", getConversationMessage?.message || []);
    io.to(data?.receiver).emit(
      "message",
      getConversationMessage?.message || []
    );

    //send conversation
    const conversationSender = await getConversation(data?.sender);
    const conversationReceiver = await getConversation(data?.receiver);

    io.to(data?.sender).emit("conversation", conversationSender);
    io.to(data?.receiver).emit("conversation", conversationReceiver);
  });

  //sidebar
  socket.on("sidebar", async (currentUserId) => {
    // console.log("current user", currentUserId);

    const conversation = await getConversation(currentUserId);

    socket.emit("conversation", conversation);
  });
    
    socket.on("seen", async (msgByUserId) => {
      let conversation = await conversationModel.findOne({
        $or: [
          { sender: user?._id, receiver: msgByUserId },
          { sender: msgByUserId, receiver: user?._id },
        ],
      });

      const conversationMessageId = conversation?.message || [];

      const updateMessages = await messageModel.updateMany(
        { _id: { $in: conversationMessageId }, msgByUserId: msgByUserId },
        { $set: { seen: true } }
      );

      //send conversation
      const conversationSender = await getConversation(user?._id?.toString());
      const conversationReceiver = await getConversation(msgByUserId);

      io.to(user?._id?.toString()).emit("conversation", conversationSender);
      io.to(msgByUserId).emit("conversation", conversationReceiver);
    });
    

  // disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id.toString());
    console.log("User disconnect", socket.id);
  });
});

module.exports = {
  app,
  server,
};
