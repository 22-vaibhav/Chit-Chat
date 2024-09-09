const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require('./../helpers/getUserDetailsFromToken');
const userModel = require("../models/userModel");
const {
  conversationModel,
  messageModel,
} = require("../models/conversationModel");

const app = express();

// Socket connection
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
});

// server running at http://localhost:8000

// online user
const onlineUser = new Set()


io.on('connection', async (socket) => {
    // console.log('User connected', socket.id);

    const token = socket.handshake.auth.token;
    // console.log("token", token);
    
    // current user details
    const user = await getUserDetailsFromToken(token);
    // console.log("user", user);

    // create a room
    socket.join(user?._id);
    onlineUser.add(user?._id?.toString());

    io.emit('onlineUser', Array.from(onlineUser))

    socket.on("message-page", async (userId) => {
        // console.log('userId', userId);
        const userDetails = await userModel.findById(userId).select('-password');

        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            profile_pic: userDetails?.profile_pic,
            online: onlineUser.has(userId)
        }

        socket.emit("message-user", payload);
    });


    // new message
    socket.on('new message', async (data) => {
      // check conversation is available for both user
      let conversation = await conversationModel.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      });

      // console.log("new message" , data);
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
            $push: { messages: saveMessage?._id },
          }
        );

        const getConversationMessage = await conversationModel.findOne({
          $or: [
            { sender: data?.sender, receiver: data?.receiver },
            { sender: data?.receiver, receiver: data?.sender },
          ],
        })
          .populate("messages")
          .sort({ updatedAt: -1 });
    })

    // disconnect
    socket.on('disconnect', () => {
        onlineUser.delete(user?._id);
        console.log("User disconnect", socket.id);
    })
})

module.exports = {
    app,
    server
}