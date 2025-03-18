// backend/models/event.model.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    default: "default"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  room: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
export default Event;