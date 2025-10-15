import { connectDB } from "@/lib/db";
import TitleWord from "@/models/TitleWord";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const titleId = searchParams.get("titleId");
  if (!titleId) return Response.json({ error: "Thiếu titleId" }, { status: 400 });

  await connectDB();
  const words = await TitleWord.find({ titleId }).sort({ createdAt: -1 });
  return Response.json(words);
}

export async function POST(req) {
  const { titleId, word, createdBy } = await req.json();
  if (!titleId || !word || !createdBy)
    return Response.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });

  await connectDB();
  const newWord = await TitleWord.create({ titleId, word, createdBy });
  return Response.json(newWord);
}
