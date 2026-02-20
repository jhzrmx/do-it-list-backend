import bcrypt from "bcryptjs";
import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string; // Optional for OAuth users
  imageUrl: string | null;
  providers: ("local" | "google")[];
  googleId?: string; // For Google OAuth
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: {
      type: String,
      required: function () {
        return this.providers.includes("local");
      },
    }, // Required only for local users
    imageUrl: { type: String, default: null },
    providers: {
      type: [String],
      enum: ["local", "google"],
      default: ["local"],
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    }, // Sparse index for optional field
  },
  { timestamps: true },
);

UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.hasPassword = function () {
  return this.providers.includes("local");
};

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  if (!this.hasPassword()) return false; // OAuth users don't have passwords
  return bcrypt.compare(candidatePassword, this.password);
};

const User = model<IUser>("User", UserSchema);

export default User;
