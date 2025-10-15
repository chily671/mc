import mongoose, { Schema } from "mongoose";

const TitleWordSchema = new Schema(
  {
    titleId: { type: Schema.Types.ObjectId, ref: "Title", required: true },
    word: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.TitleWord || mongoose.model("TitleWord", TitleWordSchema);
