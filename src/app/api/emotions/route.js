import { connectDB } from "@/lib/db";
import Emotion from "@/models/Emotion";

export async function GET() {
  await connectDB();
  const emotions = await Emotion.find();
  return Response.json(emotions);
}

export async function POST(req) {
  await connectDB();
  const { name, icon } = await req.json();
  const newEmotion = await Emotion.create({ name, icon });
  return Response.json(newEmotion);
}

export async function DELETE(req) {
  await connectDB();
  const { id } = await req.json();
  await Emotion.findByIdAndDelete(id);
  return Response.json({ message: "Deleted" });
}
