import { connectDB } from "@/lib/db";
import Title from "@/models/Title";

export async function GET() {
  await connectDB();
  const titles = await Title.find().sort({ createdAt: -1 });
  return Response.json(titles);
}

export async function POST(req) {
  const { name } = await req.json();
  if (!name)
    return Response.json({ error: "Thiếu tên title" }, { status: 400 });

  await connectDB();
  const newTitle = await Title.create({ name });
  return Response.json(newTitle);
}

export async function DELETE(req) {
  const { id } = await req.json();
  if (!id) return Response.json({ error: "Thiếu ID title" }, { status: 400 });
  await connectDB();
  await Title.findByIdAndDelete(id);
  return Response.json({ message: "Xóa title thành công" });
}
