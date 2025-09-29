import mongoose from "mongoose";

const SentenceSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

export default mongoose.models.Sentence || mongoose.model("Sentence", SentenceSchema);
