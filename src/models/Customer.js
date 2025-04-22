import mongoose from "mongoose";
import { type } from "os";

const customerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    age: { type: Number, required: true },
    location: { type: String, required: true },
    gender: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
