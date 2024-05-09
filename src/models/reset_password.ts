import { InferSchemaType, Schema, model } from "mongoose";

const ResetPasswordSchema = new Schema ({
    userId: { type: Schema.Types.ObjectId, required: true },
    resetPassword: { type: String, required: true, select: false },
})

type ResetPassword = InferSchemaType<typeof ResetPasswordSchema>;

export default model <ResetPassword>("ResetPassword", ResetPasswordSchema);