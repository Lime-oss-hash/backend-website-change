import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: String, required: true, select: false },
    email: { type: String, required: true, unique: true, select: false },
    address: { type: String, required: true, select: false },
    town: { type: String, required: true },
    postcode: {type: String, required: true},
    phoneNumber: { type: String, required: true, select: false },
    altPhoneNumber: { type: String, select: false },
    gender: { type: String, required: true, select: false },
    ethnicity: { type: String, required: true, select: false },
    disability: { type: String, required: true, select: false },
    disabilityDetails: { type: String, select: false },
    assistance: { type: String, select: false }, 
    emergencyName: { type: String, required: true, select: false},
    emergencyPhone: { type: String, required: true, select: false },
    emergencyRelationship: { type: String, required: true, select: false },
    role: { type: String, required: true },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);