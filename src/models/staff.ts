import { InferSchemaType, model, Schema } from "mongoose";

const staffSchema = new Schema({
    email: { type: String, required: true, unique: true, select: false },
    password: { type: String, required: true, unique: true, select: false},
    role: { type: String, required: true, select: false },
});

type Staff = InferSchemaType<typeof staffSchema>;

export default model<Staff>("Staff", staffSchema);