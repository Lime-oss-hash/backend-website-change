import { RequestHandler } from "express";
import createHttpError from "http-errors";
import StaffModel from "../models/staff";

// This middleware will pass all requests through as if the staff was authenticated.
export const getAuthenticatedStaff: RequestHandler = async (req, res, next) => {
    const role = "staff";

    // Optionally, you can still check if the staff ID exists and fetch the staff details.
    try {
        const staff = await StaffModel.findById(req.session.staffId || 'defaultStaffId').select("+role").exec();
        if (staff && staff.role === role) {
            next();
        } else {
            // If there is no staff or the role doesn't match, pass the request as if it was valid (for testing).
            console.log("No valid session, but passing through for development purposes.");
            next();  // Remove or comment this in production.
            // next(createHttpError(401, "Staff not authenticated")); // Uncomment this in production.
        }
    } catch (error) {
        console.error("Error fetching staff: ", error);
        next();  // For development, allow continuation even if there's an error.
        // next(createHttpError(500, "Internal Server Error")); // Use in production.
    }
};

// This middleware will assume all users are authenticated (for development).
export const userAuth: RequestHandler = (req, res, next) => {
    console.log("Skipping user authentication for development.");
    next();  // Remove or comment this line in production.
    // if (req.session.userId) {
    //     next();
    // } else {
    //     next(createHttpError(401, "User not authenticated"));
    // }
};
