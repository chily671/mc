import { connectDB } from "@/lib/db";
import Sentence from "@/models/Sentence";

export async function GET() {
  await connectDB();
  const sentences = await Sentence.find();
  return Response.json(sentences);
}

export async function POST(req) {
  await connectDB();
  const { text } = await req.json();
  const newSentence = await Sentence.create({ text });
  return Response.json(newSentence);
}

export async function DELETE(req) {
  await connectDB();
  const { id } = await req.json();
  await Sentence.findByIdAndDelete(id);
  return Response.json({ message: "Deleted" });
}
