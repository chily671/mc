import { connectDB } from "@/lib/db";
import Word from "@/models/Word";

export default async function handler(req, res) {
  await connectDB();

  try {
    const { set } = req.query;
    const query = set ? { set } : {};

    const words = await Word.find(query);
    if (words.length === 0) {
      return res
        .status(200)
        .json({ word: null, message: "⚠️ Chưa có từ nào trong bộ này" });
    }

    const randomIndex = Math.floor(Math.random() * words.length);
    res.status(200).json({ word: words[randomIndex].word });
  } catch (err) {
    res.status(500).json({ error: "❌ Lỗi khi random" });
  }
}
