import { Schema, model } from "mongoose";

interface Room {
  roomId: String;
}

const RoomSchema = new Schema<Room>({
  roomId: {
    type: String,
    unique: true,
    required: true,
  },
});

export const RoomModel = model("Room", RoomSchema);
