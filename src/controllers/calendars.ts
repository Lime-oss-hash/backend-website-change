import { RequestHandler } from "express";
import CalendarModel from "../models/calendar";
import mongoose from "mongoose";
import createHttpError from "http-errors";

export const getCalendars: RequestHandler = async (req, res, next) => {
    try {
        const calendars = await CalendarModel.find().exec();
        res.status(200).json(calendars);
    } catch (error) {
        next(error);
    }
};

export const getCalendar: RequestHandler = async (req, res, next) => {
    const calendarId = req.params.calendarId;

    try {
        if (!mongoose.isValidObjectId(calendarId)) {
            throw createHttpError(400, "Invalid calendar id");
        }

        const calendar = await CalendarModel.findById(calendarId).exec();

        if (!calendar) {
            throw createHttpError(404, "Calendar not found");
        }

        res.status(200).json(calendar);
    } catch (error) {
        next(error);
    }
};

interface CreateCalendarBody {
    date?: string,
    title?: string,
    description?: string,
    location?: string,
    startTime: string,
    endTime: string,
}

export const createCalendar: RequestHandler<unknown, unknown, CreateCalendarBody, unknown> = async (req, res, next) => {

    const date = req.body.date;
    const title = req.body.title;
    const description = req.body.description;
    const location = req.body.location;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;

    try {
        if ( !date || !title || !description || !location || !startTime || !endTime) {
            throw createHttpError(400, "Calendar must include these information");
        }

        const newCalendar = await CalendarModel.create({
            date: date,
            title: title,
            description: description,
            location: location,
            startTime: startTime,
            endTime: endTime,
        });

        res.status(201).json(newCalendar);
    } catch (error) {
        next(error);
    }
};

interface UpdateCalendarParams {
    calendarId: string,
}

interface UpdateCalendarBody {
    date?: string,
    title?: string,
    description?: string,
    location?: string,
    startTime: string,
    endTime: string,
}

export const updateCalendar: RequestHandler<UpdateCalendarParams, unknown, UpdateCalendarBody, unknown> = async (req, res, next) => {
    const calendarId = req.params.calendarId;
    const newDate = req.body.date;
    const newTitle = req.body.title;
    const newDescription = req.body.description;
    const newLocation = req.body.location;
    const newStartTime = req.body.startTime;
    const newEndTime = req.body.endTime;

    try {
        if (!mongoose.isValidObjectId(calendarId)) {
            throw createHttpError(400, "Invalid calendar id");
        }
        if ( !newDate || !newTitle || !newDescription || !newLocation || !newStartTime || !newEndTime) {
            throw createHttpError(400, "Calendar must include these information");
        }

        const calendar = await CalendarModel.findById(calendarId).exec();

        if (!calendar) {
            throw createHttpError(404, "Calendar not found");
        }

        calendar.date = newDate;
        calendar.title = newTitle;
        calendar.description = newDescription;
        calendar.location = newLocation;
        calendar.startTime = newStartTime;
        calendar.endTime = newEndTime;

        const updateCalendar = await calendar.save();

        res.status(200).json(updateCalendar);
    } catch (error) {
        next(error);
    }
};

export const deleteCalendar: RequestHandler = async (req, res, next) => {
    const calendarId = req.params.calendarId;

    try {
        if (!mongoose.isValidObjectId(calendarId)) {
            throw createHttpError(400, "Invalid calendar id");
        }
        const calendar = await CalendarModel.findById(calendarId).exec();

        if (!calendar) {
            throw createHttpError(404, "Calendar not found");
        }

        await calendar.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};