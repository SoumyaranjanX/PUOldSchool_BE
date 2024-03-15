import { Event } from '../models/eventModel.js';
import { asyncHandler } from "../errorHander/asyncHandler.js";
import { ApiError } from "../errorHander/ApiError.js";
import { ApiResponse } from "../errorHander/ApiResponse.js";
// Controller function to store an event
export const createEvent = asyncHandler(async (req, res, next) => {
    try {
        const {
            eventName,
            category,
            location,
            formData,
            formTime,
            toDate,
            toTime,
            imageUrl
        } = req.body;
        if (!eventName || !category || !location || !formData || !formTime || !toDate || !imageUrl) {
            return next(new ApiError("Volt Type andimage is required.", 400));
        }

        console.log(req.user._id)
        // Create a new Event instance with the provided data
        const event = new Event({
            eventManger: req.user._id,
            eventName,
            category,
            location,
            FormData: new Date(),
            FormTime: new Date(),
            toDate,
            toTime,
            imageUrl,
        });

        // Save the event to the database
        const savedEvent = await event.save();

        return res.status(200).json(
            new ApiResponse(200, savedEvent, "Event Created Successfully.")
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export const deleteEvent = asyncHandler(async (req, res, next) => {
    try {
        const eventId = req.params.id;

        // Check if the event exists
        const existingEvent = await Event.findById(eventId);
        if (!existingEvent) {
            return next(new ApiError("Event not found", 404));
        }

        // Delete the event
        await Event.findByIdAndDelete(eventId);

        return res.status(200).json(
            new ApiResponse(200, {}, "Event Deleted Successfully.")
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export const updateEvent = asyncHandler(async (req, res, next) => {
    try {
        const eventId = req.params.id;
        const {
            eventName,
            category,
            location,
            formDate,
            formTime,
            toDate,
            toTime,
            imageUrl
        } = req.body;

        // Check if the event exists
        const existingEvent = await Event.findById(eventId);
        if (!existingEvent) {
            return next(new ApiError("Event not found", 404));
        }
        // Update the event
        existingEvent.eventName = eventName;
        existingEvent.category = category;
        existingEvent.location = location;
        existingEvent.FormDate = formDate;
        existingEvent.FormTime = formTime;
        existingEvent.toDate = toDate;
        existingEvent.toTime = toTime;
        existingEvent.imageUrl = imageUrl;

        const updatedEvent = await existingEvent.save();

        return res.status(200).json(
            new ApiResponse(200, updatedEvent, "Event Updated Successfully.")
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export const getEvent = asyncHandler(async (req, res, next) => {
    try {
        const eventId = req.params.id;; // Assuming eventId is passed as a URL parameter
        console.log(eventId)
        // Find the event by its ID
        const event = await Event.findById(eventId) // Adjust the population fields as needed

        if (!event) {
            return next(new ApiError('Event not found', 404));
        }

        return res.status(200).json(
            new ApiResponse(200, event, 'Event Details Retrieved Successfully.')
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


