// backend/controllers/event.controller.js
import Event from "../models/event.model.js";
import { errorHandler } from "../utils/error.js";

export const createEvent = async (req, res, next) => {
    
  try {
    const { title, start, end, category, room, userId } = req.body;
    if (!userId) {
        return next(errorHandler(400, "User ID is required"));
      }

    const newEvent = new Event({
      title,
      start,
      end,
      category,
      userId,
      room
    });

    await newEvent.save();
    res.status(201).json({ 
      success: true,
      message: "Event created successfully",
      event: newEvent 
    });
  } catch (error) {
    next(errorHandler(500, "Error creating event"));
  }
};

export const getEvents = async (req, res, next) => {
  try {
    const room = req.params.room;
    const events = await Event.find({ room });
    res.status(200).json({
      success: true,
      events
    });
  } catch (error) {
    next(errorHandler(500, "Error fetching events"));
  }
};