import { RequestHandler } from "express";
import createHttpError from "http-errors";
import StaffModel from "../models/staff";
import bcrypt from "bcrypt";

export const getAuthenticatedStaff: RequestHandler = async (req, res, next) => {
    const authenticatedStaffId = req.session.staffId;
    try {
        const staff = await StaffModel.findById(authenticatedStaffId).select("+email").exec();
        res.status(200).json(staff);
    } catch (error) {
        next(error);
    }
};

interface StaffSignUpBody {
    email?: string,
    password?: string,
    role?: string,
}

export const StaffSignUp: RequestHandler<unknown, unknown, StaffSignUpBody, unknown> = async (req, res, next) => {
    const email = req.body.email;
    const passwordRaw = req.body.password;
    const role = "staff";

    try {
        if (!email || !passwordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        if (!email.includes("@wakaeasternbay.org.nz")) {
            throw createHttpError(409, "Staff email must be registered with Waka Eastern Bay email address");
        }

        const existingEmail = await StaffModel.findOne({ email: email }).exec();

        if (existingEmail) {
            throw createHttpError(409, "A staff with this email address already exists. Please log in instead");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newStaff = await StaffModel.create({
            email: email,
            password: passwordHashed,
            role: role,
        });

        req.session.staffId = newStaff._id;

        res.status(201).json(newStaff);
    } catch (error) {
        next(error);
    }
};

interface StaffLoginBody {
    email?: string,
    password?: string,
}

export const StaffLogin: RequestHandler<unknown, unknown, StaffLoginBody, unknown> = async (req, res, next) => {
    const email = req.body.email;
    
    try {
        if (!email) {
            throw createHttpError(400, "Email is required");
        }

        const staff = await StaffModel.findOne({ email: email }).exec();

        if (!staff) {
            throw createHttpError(401, "Email address is incorrect");
        }

        req.session.staffId = staff._id;
        res.status(201).json(staff);

    } catch (error) {
        next(error);
    }
};

export const StaffLogout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    });
};
