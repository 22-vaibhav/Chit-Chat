const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookiesParser = require('cookie-parser');
const {app, server} = require('./socket/index')

const connectDB = require("./config/connectDB");
const router = require('./router/index')

// const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: "https://chit-chat-front.vercel.app",
    methods: ["GET", "POST"],
    credentials: true, // If you need to send cookies with requests
  })
);

app.use(express.json());
app.use(cookiesParser());

app.get("/", (req, res) => {
  res.json({
    message: "Hello World!!",
  });
});

// api endpoints
app.use('/api', router)

connectDB().then(() => {
  console.log("Connection Successful");
  server.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });
});
