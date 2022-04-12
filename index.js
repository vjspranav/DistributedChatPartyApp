const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Set user name
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chat message", (msg) => {
    console.log(socket.user + ": " + msg);
    socket.broadcast.emit("chat message", msg, socket.user);
  });
  socket.on("setUser", (user) => {
    socket.user = user;
    console.log(socket.user);
  });
  // Catch video playing, video paused, video ended
  socket.on("video playing", (time) => {
    socket.broadcast.emit("video playing", time, socket.user);
  });
  socket.on("video paused", (video) => {
    socket.broadcast.emit("video paused", socket.user);
  });
  socket.on("video ended", (video) => {
    socket.broadcast.emit("video ended", video, socket.user);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
