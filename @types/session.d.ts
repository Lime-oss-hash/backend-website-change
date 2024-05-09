import mongoose from "mongoose";

declare module "express-session" {
    interface SessionData {
        staffId: mongoose.Types.ObjectId;
        userId: mongoose.Types.ObjectId;
    }
}