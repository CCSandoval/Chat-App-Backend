import { Schema, model } from "mongoose";
import { RoomModel } from "./Rooms";

interface Message {
  user: String;
  message: String;
  room: Schema.Types.ObjectId;
}

const MessageSchema = new Schema<Message>({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  room: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: RoomModel,
  },
});

export const MessageModel = model("Message", MessageSchema);
