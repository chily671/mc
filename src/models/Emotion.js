import mongoose from "mongoose";

const EmotionSchema = new mongoose.Schema({
  name: { type: String, required: true },   // Happy, Sad, Angry...
  icon: { type: String },                   // emoji: 😊, 😢, 😡 ...
});

export default mongoose.models.Emotion || mongoose.model("Emotion", EmotionSchema);
