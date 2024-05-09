import { InferSchemaType, Schema, model } from "mongoose";

const calendarSchema = new Schema({
    calendarId: { type: Schema.Types.ObjectId },
    date: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
}, { timestamps: true });

type Calendar = InferSchemaType<typeof calendarSchema>;

export default model<Calendar>("Calenadar", calendarSchema);