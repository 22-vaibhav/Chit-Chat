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
    origin: process.env.FRONTEND_URL,
    credentials: true,
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
