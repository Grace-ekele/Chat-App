const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const { generateMessage } = require("./utils/messages");
//const Filter = require('bad-words')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = 5000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.emit("message", generateMessage("welcome!"));
  socket.broadcast.emit("message", generateMessage("A new user has joined!"));

  socket.on("sendMessage", (message, callback) => {
    //  const filter = new Filter()

    //   if(filter.isProfane(message)){
    //     return callback('profanity is not allowed')
    //   }

    io.emit("message", generateMessage(message));
    callback();
  });

  socket.on("sendLocation", (position, callback) => {
    io.emit(
      "locationMessage",
      `https://google.com/maps?q=${position.latitude},${position.longitude}`
    );
    callback();
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    // socket.broadcast.emit("message", "A user has left the chat.");
    io.emit("message", generateMessage("A user has left the chat."));
  });
});

// Start the server and listen on the specified port
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
