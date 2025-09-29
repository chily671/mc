import { connectDB } from "@/lib/db";
import Sentence from "@/models/Sentence";

export async function GET() {
  await connectDB();
  const count = await Sentence.countDocuments();
  const rand = Math.floor(Math.random() * count);
  const sentence = await Sentence.findOne().skip(rand);
  return new Response(JSON.stringify(sentence), { status: 200 });
}
