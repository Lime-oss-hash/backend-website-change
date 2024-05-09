import { RequestHandler } from "express";
import env from "../util/validateEnv";
import nodemailer from "nodemailer";
import UserModel from "../models/user";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { signJWT, verifyJWT } from "../util/jwt.utils";
import mongoose from "mongoose";

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

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.session.userId).select("+email").exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

interface UserSignUpBody {
    username?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    dob?: string,
    email?: string,
    address?: string,
    town?: string,
    postcode?: string,
    phoneNumber?: string,
    altPhoneNumber?: string,
    gender?: string,
    ethnicity?: string,
    disability?: string,
    disabilityDetails?: string,
    assistance?: string,
    emergencyName?: string,
    emergencyPhone?: string,
    emergencyRelationship: string,
    role?: string,
}

export const UserSignUp: RequestHandler<unknown, unknown, UserSignUpBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const passwordRaw = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const dob = req.body.dob;
    const email = req.body.email;
    const address = req.body.address;
    const town = req.body.town;
    const postcode = req.body.postcode;
    const phoneNumber = req.body.phoneNumber;
    const altPhoneNumber = req.body.altPhoneNumber;
    const gender = req.body.gender;
    const ethnicity = req.body.ethnicity;
    const disability = req.body.disability;
    const disabilityDetails = req.body.disabilityDetails;
    const assistance = req.body.assistance;
    const emergencyName = req.body.emergencyName;
    const emergencyPhone = req.body.emergencyPhone;
    const emergencyRelationship = req.body.emergencyRelationship;
    const role = "user";

    try {
        if (!username || !passwordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        const exisitingUsername = await UserModel.findOne({ username: username }).exec();

        if (exisitingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different username or log in instead");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            username: username,
            password: passwordHashed,
            firstName: firstName,
            lastName: lastName,
            dob: dob,
            email: email,
            address: address,
            town: town,
            postcode: postcode,
            phoneNumber: phoneNumber,
            altPhoneNumber: altPhoneNumber,
            gender: gender,
            ethnicity: ethnicity,
            disability: disability,
            disabilityDetails: disabilityDetails,
            assistance: assistance,
            emergencyName: emergencyName,
            emergencyPhone: emergencyPhone,
            emergencyRelationship: emergencyRelationship,
            role: role,
        });

        const accessToken = signJWT({ email: newUser.email }, "24h");

        const link = `http://localhost:3000/resetpassword/${newUser._id}`;

        const data = await transporter.sendMail({
            "from": "miskan22@student.wintec.ac.nz",
            "to": "miskan22@student.wintec.ac.nz",
            "subject": "Your Application has been approved",
            "html": `<p>Dear ${firstName}, ${lastName}<p>
            <p>We would love to inform you that your application with Waka Eastern Bay Community Transport has been approved.</p>
            <p>Please click the <a href="${link}"> link</a> to activate your account.</p>
            <p>This link will only be valid for 24 hours from the time you received this email.</p>
            <p>Please click the "forgot password" again if the link has expired.</p>
            <p>Ngā mihi/Kind regards.</p>
            <p>Reneé Lubbe</p>
            <p>Project Manager</p>
            <p><a href="https://wakaeasternbay.org.nz">https://wakaeasternbay.org.nz</a></p>
            <p>Waka Eastern Bay Community Transport</p>`
        });

        console.log("Message sent: %s", data.response);
        res.status(201).json(accessToken);
    } catch (error) {
        next(error);
    }
};

interface UserLoginBody {
    username?: string,
    password?: string,
}

export const UserLogin: RequestHandler<unknown, unknown, UserLoginBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (!username || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        const user = await UserModel.findOne({ username: username }).select("+password +username").exec();

        if (!user) {
            throw createHttpError(401, "Username is incorrect");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw createHttpError(401, "Password is incorrect");
        }

        req.session.userId = user._id;
        res.status(201).json(user);

    } catch (error) {
        next(error);
    }
};

export const UserLogout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    })
};

interface ForgotPasswordBody {
    email?: string,
}

export const ForgotPassword: RequestHandler<unknown, unknown, ForgotPasswordBody, unknown> = async (req, res, next) => {
    const email = req.body.email;

    try {
        if (!email) {
            throw createHttpError(400, "Parameters missing");
        }
        
        const user = await UserModel.findOne({ email: email }).select("+email").exec();

        if (!user) {
            throw createHttpError(404, "User not found");
        }

        const accessToken = signJWT({ email: user.email }, "1h");

        const link = `http://localhost:3000/forgotpasswordpage/${user._id}`;

        const data = await transporter.sendMail({
            "from": "miskan22@student.wintec.ac.nz",
            "to": "miskan22@student.wintec.ac.nz",
            "subject": "Reset your password",
            "html": `<p>Dear ${user.firstName}, ${user.lastName}</p>
            <p>Please click the <a href="${link}"> link</a> to change your current password.</p>
            <p>This link will only be valid for 1 hour from the time you received this email.</p>
            <p>Please click the "reset password" again if the link has expired.</p>
            <p>Ngā mihi/Kind regards.</p>
            <p>Reneé Lubbe</p>
            <p>Project Manager</p>
            <p><a href="https://wakaeasternbay.org.nz">https://wakaeasternbay.org.nz</a></p>
            <p>Waka Eastern Bay Community Transport</p>`
        });

        res.status(200).json(data.response);
        res.status(200).json(accessToken);

    } catch (error) {
        next(error);
    }
};

interface ChangePasswordParams {
    userId: string,
    accessToken: string,
}

interface ChangePasswordBody {
    password?: string,
}

export const ChangePassword: RequestHandler<ChangePasswordParams, unknown, ChangePasswordBody, unknown> = async (req, res, next) => {
    const passwordRaw = req.body.password;
    const userId = req.params.userId;
    const accessToken = req.params.accessToken;

    try {
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid user Id");
        }

        const user = await UserModel.findById(userId).exec();

        if (!user) {
            throw createHttpError(404, "User not found");
        }

        if (!passwordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        res.cookie("accessToken", accessToken, {
            maxAge: 100 * 36000,
            httpOnly: true,
        });

        res.send(verifyJWT(accessToken).payload);

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        user.password = passwordHashed;
        const changePassword = await user.save();

        res.status(200).json(changePassword);
    } catch (error) {
        next(error);
    }
};