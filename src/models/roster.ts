import { InferSchemaType, Schema, model } from "mongoose";

const rosterSchema = new Schema({
    rosterId: { type: Schema.Types.ObjectId },
    date: { type: String, required: true },
    driverName: { type: String, required: true },
    vehiclePlate: { type: String, required: true },
    startTime: { type: String, required: true },
    finishTime: { type: String, required: true },
    availabilityTime: { type: [String], required: true },
    availabilityStatus: { type: [String], required: true },
}, {timestamps: true});

type Roster = InferSchemaType<typeof rosterSchema>;

export default model<Roster>("Roster", rosterSchema);