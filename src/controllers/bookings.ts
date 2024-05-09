import { RequestHandler } from "express";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import BookingModel from "../models/booking";
import { assertIsDefined } from "../util/assertIsDefined";
import env from "../util/validateEnv";
import nodemailer from "nodemailer";
import { signJWT } from "../util/jwt.utils";

const config = {
    host: env.SMTP_SERVER_ADDRESS,
    port: env.SMTP_PORT,
    secure: false,
    auth: {
        user: env.SMTP_LOGIN,
        pass: env.SMTP_PASSWORD,
    },
};

const transporter = nodemailer.createTransport(config);

export const getBookings: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const bookings = await BookingModel.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(bookings);
    } catch (error) {
        next(error);
    }
};

export const getAllBookings: RequestHandler = async (req, res, next) => {
    try {
        const bookings = await BookingModel.find().exec();
        res.status(200).json(bookings);
    } catch (error) {
        next(error);
    }
};

export const getBooking: RequestHandler = async (req, res, next) => {
    const bookingId = req.params.bookingId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(bookingId)) {
            throw createHttpError(400, "Invalid booking id");
        }

        const booking = await BookingModel.findById(bookingId).exec();

        if (!booking) {
            throw createHttpError(404, "Booking not found");
        }

        if (!booking.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this booking");
        }

        res.status(200).json(booking);
    } catch (error) {
        next(error);
    }
};

interface CreateBookingBody {
    firstName?: string,
    lastName?: string,
    phoneNumber?: string,
    email?: string,
    pickup?: string,
    destination?: string, 
    wheelchair?: string, 
    passenger?: number, 
    purpose?: string,
    trip?: string,
    date?: string,
    pickupTime?: string,
    dropoffTime?: string,
    additionalNotes?: string,
}

export const createBooking: RequestHandler<unknown, unknown, CreateBookingBody, unknown> = async (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phoneNumber = req.body.phoneNumber;
    const email = req.body.email;
    const pickup = req.body.pickup;
    const destination = req.body.destination;
    const wheelchair = req.body.wheelchair;
    const passenger = req.body.passenger;
    const purpose = req.body.purpose;
    const trip = req.body.trip;
    const date = req.body.date;
    const pickupTime = req.body.pickupTime;
    const dropoffTime = req.body.dropoffTime;
    const additionalNotes = req.body.additionalNotes;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!firstName || !lastName) {
            throw createHttpError(400, "Booking must have a passenger's name");
        } else if (!phoneNumber) {
            throw createHttpError(400, "Booking must have a passenger's phone number");
        } else if (!email) {
            throw createHttpError(400, "Booking must have a passenger's email address");
        } else if (!pickup) {
            throw createHttpError(400, "Booking must have a pick-up address");
        } else if (!destination) {
            throw createHttpError(400, "Booking must have a destination address");
        } else if (!wheelchair) {
            throw createHttpError(400, "Booking must have a wheelchair question answered");
        } else if (!passenger) {
            throw createHttpError(400, "Booking must state the number of passengers");
        } else if (!purpose) {
            throw createHttpError(400, "Booking must have a purpose");
        } else if (!trip) {
            throw createHttpError(400, "Booking must have the number of trips");
        } else if (!date) {
            throw createHttpError(400, "Booking must have a booking date");
        } else if (!pickupTime) {
            throw createHttpError(400, "Booking must have a pick-up time");
        } else if (!dropoffTime) {
            throw createHttpError(400, "Booking must have a drop-off time");
        }

        const newBooking = await BookingModel.create({
            userId: authenticatedUserId,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            email: email,
            pickup: pickup,
            destination: destination,
            wheelchair: wheelchair,
            passenger: passenger,
            purpose: purpose,
            trip: trip,
            date: date,
            pickupTime: pickupTime,
            dropoffTime: dropoffTime,
            additionalNotes: additionalNotes,
        });

        const accessToken = signJWT({ email: newBooking }, "24h");

        const data = await transporter.sendMail({
            "from": "miskan22@student.wintec.ac.nz",
            "to": "miskan22@student.wintec.ac.nz",
            "subject": "Your Booking Request",
            "html": `<p>Dear ${firstName}, ${lastName}</p>
            <p>We would love to inform you that your booking request with 
            Waka Eastern Bay Community Transport has been requested.</p>
            <p>NOTE: This is confirmation email.</p>
            <p>Ngā mihi/Kind regards.</p>
            <p>Reneé Lubbe</p>
            <p>Project Manager</p>
            <p><a href="https://wakaeasternbay.org.nz">https://wakaeasternbay.org.nz</a></p>
            <p>Waka Eastern Bay Community Transport</p>`
        });

        const mail = await transporter.sendMail({
            "from": "miskan22@student.wintec.ac.nz",
            "to": "miskan22@student.wintec.ac.nz",
            "subject": "User's Booking Request",
            "html": `<p>${firstName}, ${lastName} has been made a booking request with 
            Waka Eastern Bay Community Transport.</p>
            <p>NOTE: This is confirmation email.</p>
            <p><a href="https://wakaeasternbay.org.nz">https://wakaeasternbay.org.nz</a></p>
            <p>Waka Eastern Bay Community Transport</p>`
        });

        console.log("Message sent: %s", data.response);
        console.log("Message sent: %s", mail.response);
        res.status(201).json(accessToken);
        
    } catch (error) {
        next(error);
    }
};

export const deleteUserBooking: RequestHandler = async (req, res, next) => {
    const bookingId = req.params.bookingId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(bookingId)) {
            throw createHttpError(400, "Invalid booking id");
        }

        const booking = await BookingModel.findById(bookingId).exec();

        if (!booking) {
            throw createHttpError(404, "Booking not found");
        }

        if (!booking.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this booking");
        }

        await booking.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

export const deleteStaffBooking: RequestHandler = async (req, res, next) => {
    const bookingId = req.params.bookingId;

    try {
        if (!mongoose.isValidObjectId(bookingId)) {
            throw createHttpError(400, "Invalid booking Id");
        }

        const booking = await BookingModel.findById(bookingId).exec();

        if (!booking) {
            throw createHttpError(404, "Booking not found");
        }
        await booking.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};