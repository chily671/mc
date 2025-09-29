import { connectDB } from "@/lib/db";
import Word from "@/models/Word";

export async function POST(req) {
  await connectDB();
  const { word, category } = await req.json();
  const newWord = await Word.create({ word, category });
  return Response.json(newWord);
}

export async function GET() {
  await connectDB();
  const words = await Word.find();
  return Response.json(words);
}

// DELETE remove word
export async function DELETE(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await Word.findByIdAndDelete(id);
  return Response.json({ message: "Deleted" });
}

export async function PUT(req) {
  await connectDB();
  const { _id, word, category } = await req.json();
  const updatedWord = await Word.findByIdAndUpdate(
    _id,
    { word, category },
    { new: true }
  );
  return Response.json(updatedWord);
}
