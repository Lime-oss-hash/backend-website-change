import { InferSchemaType, model, Schema } from "mongoose";

const bookingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    pickup: { type: String, required: true },
    destination: { type: String, required: true },
    wheelchair: { type: String, required: true },
    passenger: { type: Number, required: true },
    purpose: { type: String, required: true },
    trip: { type: String, required: true },
    date: { type: String, required: true },
    pickupTime: { type: String, required: true },
    dropoffTime: { type: String, required: true },
    additionalNotes: { type: String },
}, { timestamps: true });
 
type Booking = InferSchemaType<typeof bookingSchema>;

export default model<Booking>("Booking", bookingSchema);