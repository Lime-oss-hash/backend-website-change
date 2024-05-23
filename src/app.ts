import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import staffRoutes from "./routes/staffs";
import userRoutes from "./routes/users";
import registerRoutes from "./routes/registers";
import bookingRoutes from "./routes/bookings";
import rosterRoutes from "./routes/rosters";
import calendarRoutes from "./routes/calendars";
import morgan from "morgan";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import session from "express-session";
import { getAuthenticatedStaff } from "./middleware/auth";
import createHttpError, { isHttpError } from "http-errors";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(
    cors({
        credentials: true,
        origin: "https://wekafrontend.netlify.app",  // Updated to your frontend domain
    })
);

app.use(cookieParser());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    }),
}));

app.use("/api/users", userRoutes);

app.use("/api/staffs", staffRoutes);

app.use("/api/registers", registerRoutes);

app.use("/api/rosters", getAuthenticatedStaff, rosterRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/calendars", calendarRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app;
