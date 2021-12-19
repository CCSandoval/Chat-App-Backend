import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv = require("dotenv");
import cors = require("cors");
import { ConnectDB } from "./db/db";

dotenv.config({ path: "./.env" });
const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
    allowedHeaders: "*",
  },
});

app.use(cors());

//io.on() = La función entregada se ejecutará cada vez que un usuario se conecte al servidor
io.on("connection", (socket) => {
  console.log(`User connected on: ${socket.id}`);

  //Receives a parameter named data, the frontend sends the id as the data so that the user joins a chatroom with that id
  socket.on("joinRoom", (data) => {
    socket.join(data.room);
    console.log(
      `User ${data.username} joined the room ${data.room} (UserID: ${socket.id})`
    );
  });

  //Receives a parameter named data
  //The frontend sends the message, time, user and room as the data so we can display it to the other users in the room
  socket.on("sendMessage", (data) => {
    //Sends the message, time, user and room as the data to the frontend display to the user
    //Display the message to a specific thanks to the .to(data.room)
    socket.to(data.room).emit("receiveMessage", data);
    console.log(
      `${data.user} sent the message: ${data.message} in room ${data.room}`
    );
  });

  //socket.on("disconnect") ejecuta la función entregada cuando el usuario se desconecta
  socket.on("disconnect", () => {
    console.log(`User disconnected from: ${socket.id}`);
  });
});

server.listen(process.env.PORT, async () => {
  await ConnectDB();
  console.log("🚀 Servidor iniciado en en 8000");
});
