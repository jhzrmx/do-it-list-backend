import { Document, Schema, Types, model } from "mongoose";

export interface ITodo extends Document {
  title: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  user: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema = new Schema<ITodo>(
  {
    title: { type: String, required: true, trim: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    completed: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

const Todo = model<ITodo>("Todo", TodoSchema);

export default Todo;
