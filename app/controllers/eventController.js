import { Event } from '../models/eventModel.js';
import { asyncHandler } from "../errorHander/asyncHandler.js";
import { ApiError } from "../errorHander/ApiError.js";
import { ApiResponse } from "../errorHander/ApiResponse.js";
import path from "path";
import fs from "fs"
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

import { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: 'auto',
    endpoint: 'https://5aa4c0acb0e25214c16ca695275482a8.r2.cloudflarestorage.com',
    credentials: {
        accessKeyId: '047595cdddd6f641d1665c8df6795aee',
        secretAccessKey: '05e386894068a1329c5a2236b1661c2f46dbc8d0cc81f22d451a2b5f2c0c0ccb',
    },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Controller function to store an event


export const createEvent = asyncHandler(async (req, res, next) => {
    try {
        const user = req.user;
        const {
            eventName,
            category,
            location,
            fromDate,
            fromTime,
            toDate,
            toTime,
            eventDetails,
            isApproved
        } = req.body;
        if (!eventName || !category || !location || !fromDate || !fromTime || !toDate) {
            return next(new ApiError("Volt Type and image are required.", 400));
        }

        const file = req.file;

        const userId = user.id;

        const uniqueFilename = userId + "-Event-" + file.originalname;

        const params = {
            Bucket: 'oldschool',
            Key: uniqueFilename,
            Body: fs.createReadStream(file.path)
        };

        const data = await s3Client.send(new PutObjectCommand(params));
        console.log("Successfully uploaded file to S3:", data);

        // Create a new Event instance with the provided data
        const event = new Event({
            eventManager: req.user._id,
            eventName,
            category,
            location,
            fromDate,
            fromTime,
            toDate,
            toTime,
            eventDetails,
            imageUrl: `https://pub-dc2feb6aa8314296ab626daad5932a49.r2.dev/${uniqueFilename}`
        });

        // Save the event to the database
        const savedEvent = await event.save();

        return res.status(200).json(
            new ApiResponse(200, savedEvent, "Event Created Successfully! If it is approved, you will be notified in your registered email. Thank you.")
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
            fromDate,
            fromTime,
            toDate,
            toTime,
            imageUrl,
            isApproved

        } = req.body;

        // Check if the event exists
        const existingEvent = await Event.findById(eventId);
        if (!existingEvent) {
            return next(new ApiError("Event not found", 404));
        }
        // Update the event
        existingEvent.eventName = eventName || existingEvent.eventName;
        existingEvent.category = category || existingEvent.category;
        existingEvent.location = location || existingEvent.location;
        existingEvent.fromDate = fromDate || existingEvent.fromDate;
        existingEvent.fromTime = fromTime || existingEvent.fromTime;
        existingEvent.toDate = toDate || existingEvent.toDate;
        existingEvent.toTime = toTime || existingEvent.toTime;
        existingEvent.imageUrl = imageUrl || existingEvent.imageUrl;
        existingEvent.isApproved = isApproved !== undefined ? isApproved : existingEvent.isApproved;

        const updatedEvent = await existingEvent.save();

        return res.status(200).json(
            new ApiResponse(200, updatedEvent, "Event Updated Successfully.")
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export const getEvents = asyncHandler(async (req, res, next) => {


    try {

        const events = await Event.find({ isApproved: true })// Adjust the population fields as needed

        if (!events) {
            return next(new ApiError('Event not found', 404));
        }
        // const host = req.get('host');
        // const protocol = req.protocol;
        // const eventsWithFinalImageUrl = events.map(event => {
        //     const imageUrl = event.imageUrl ? event.imageUrl : '/public/assets/profileImages/default.webp'; // Default image URL
        //     const finalImageUrl = `${protocol}://${host}${imageUrl}`;
        //     return { ...event.toObject(), imageUrl: finalImageUrl }; // Merge the event object with the finalImageUrl
        // });

        return res.status(200).json(
            new ApiResponse(200, events, 'Event Details Retrieved Successfully.')
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export const getEventsAll = asyncHandler(async (req, res, next) => {


    try {

        const events = await Event.find()// Adjust the population fields as needed

        if (!events) {
            return next(new ApiError('Event not found', 404));
        }
        // const host = req.get('host');
        // const protocol = req.protocol;
        // const eventsWithFinalImageUrl = events.map(event => {
        //     const imageUrl = event.imageUrl ? event.imageUrl : '/public/assets/profileImages/default.webp'; // Default image URL
        //     const finalImageUrl = `${protocol}://${host}${imageUrl}`;
        //     return { ...event.toObject(), imageUrl: finalImageUrl }; // Merge the event object with the finalImageUrl
        // });

        return res.status(200).json(
            new ApiResponse(200, events, 'Event Details Retrieved Successfully.')
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});



