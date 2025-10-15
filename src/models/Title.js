import mongoose, { Schema } from "mongoose";

const TitleSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Title || mongoose.model("Title", TitleSchema);
