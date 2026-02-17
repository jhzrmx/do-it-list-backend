import { Document, Schema, Types, model } from "mongoose";

export interface IPasswordReset extends Document {
  user: Types.ObjectId;
  token: string;
  expiresAt: Date;
  used: boolean;
}

const PasswordResetSchema = new Schema<IPasswordReset>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default model<IPasswordReset>("PasswordReset", PasswordResetSchema);
