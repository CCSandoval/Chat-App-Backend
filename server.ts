import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv = require("dotenv");
import cors = require("cors");
import { ConnectDB } from "./db/db";
import { RoomModel } from "./models/Rooms";
import { MessageModel } from "./models/Messages";

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
  //Receives a parameter named data, the frontend sends the id as the data so that the user joins a chatroom with that id
  socket.on("joinRoom", async (data) => {
    const foundRoom = await RoomModel.findOne({ roomId: data.room });
    if (foundRoom) {
      socket.join(data.room);
      const roomMessages = await MessageModel.find({ room: foundRoom._id });
      socket.emit("sendMessages", roomMessages);
    } else {
      await RoomModel.create({ roomId: data.room })        
        .catch((e) => {
          console.log("Error creando la sala", e);
        });
    }
  });

  //Receives a parameter named data
  //The frontend sends the message, time, user and room as the data so we can display it to the other users in the room
  socket.on("sendMessage", async (data) => {
    const sala = await RoomModel.findOne({ roomId: data.room });
    await MessageModel.create({
      user: data.user,
      message: data.message,
      room: sala._id,
      time: data.time,
    })
      .then(() => {
        console.log("Mensaje creado");
      })
      .catch((e) => {
        console.log("Error creando el mensaje", e);
      });

    //Sends the message, time, user and room as the data to the frontend display to the user
    //Display the message to a specific thanks to the .to(data.room)
    socket.to(data.room).emit("receiveMessage", data);
  });

  //socket.on("disconnect") ejecuta la función entregada cuando el usuario se desconecta
  socket.on("disconnect", () => {
    console.log(`User disconnected from: ${socket.id}`);
  });
});

server.listen(process.env.PORT || 5000, async () => {
  await ConnectDB();
  console.log("🚀 Servidor iniciado en", process.env.PORT || 5000);
});
