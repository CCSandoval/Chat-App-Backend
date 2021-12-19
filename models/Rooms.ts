import { Schema, model } from "mongoose";
import { MessageModel } from "./Messages";

interface Room {
  roomId: String;
  messages: [Schema.Types.ObjectId];
}

const RoomSchema = new Schema<Room>({
  roomId: {
    type: String,
    unique: true,
    required: true,
  },
  messages: [
    {
      type: String,
    },
  ],
});

export const RoomModel = model("Room", RoomSchema);
