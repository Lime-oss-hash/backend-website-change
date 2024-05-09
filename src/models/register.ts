import { InferSchemaType, model, Schema } from "mongoose";

const registerSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    town: { type: String, required: true },
    postcode: {type: String, required: true},
    phoneNumber: { type: String, required: true },
    altPhoneNumber: { type: String },
    gender: { type: String, required: true },
    ethnicity: { type: String, required: true },
    disability: { type: String, required: true },
    disabilityDetails: { type: String },
    assistance: { type: String, required: true },
    emergencyName: { type: String, required: true },
    emergencyPhone: { type: String, required: true },
    emergencyRelationship: { type: String, required: true },
}, { timestamps: true });

type Register = InferSchemaType<typeof registerSchema>;

export default model<Register>("Register", registerSchema);