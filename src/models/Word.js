import mongoose from "mongoose";

const WordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  category: { type: String, default: "general" },
});

export default mongoose.models.Word || mongoose.model("Word", WordSchema);
