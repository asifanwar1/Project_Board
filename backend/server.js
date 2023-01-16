const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config({ path: './config.env' });

// require('./database/dbConnection'); 


app.use(express.json());
app.use(cookieParser());

app.use(require('./routers/router'));

app.use("/uploads",express.static('uploads'));

const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


const server = app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
    },
});


io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setUser", (userProfile) => {
      socket.join(userProfile.id);
      socket.emit("User Connected");
    });
  
    socket.on("joinSelectedChat", (chat) => {
      socket.join(chat);
      console.log("User Joined Room: " + chat);
    }); 
   
  
    socket.on("sendingMessage", (data) => {
      let receivedMessage = data.newMessage;
      let currentChat = data.getChat;

      currentChat.users.forEach((user) => {
        socket.to(user).emit("messageRecieved", receivedMessage);
      });

  
    });
  
    socket.off("setUser", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userProfile.id);
    });
  });
