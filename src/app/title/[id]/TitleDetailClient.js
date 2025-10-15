"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function TitleDetailClient({ id }) {
  const [title, setTitle] = useState(null);
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [form, setForm] = useState({ word: "", createdBy: "" });
  const [positions, setPositions] = useState([]);
  const containerRef = useRef(null);

  // 📦 Lấy dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      const [titleRes, wordsRes] = await Promise.all([
        fetch(`/api/title/${id}`),
        fetch(`/api/titleword?titleId=${id}`),
      ]);
      const titleData = await titleRes.json();
      const wordsData = await wordsRes.json();
      setTitle(titleData);
      setWords(wordsData);
    };
    fetchData();
  }, [id]);

  // 🧠 Hàm tạo vị trí tránh trùng, dựa theo kích thước container thật
  const generatePositions = (count, width, height, minDistance = 80) => {
    const positions = [];
    let attempts = 0;

    while (positions.length < count && attempts < count * 100) {
      const x = Math.random() * (width - 120);
      const y = Math.random() * (height - 80);
      const tooClose = positions.some(
        (p) => Math.hypot(p.x - x, p.y - y) < minDistance
      );
      if (!tooClose) positions.push({ x, y });
      attempts++;
    }

    return positions;
  };

  // 🔄 Tạo vị trí mỗi khi danh sách từ thay đổi hoặc resize
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 640;
      const minDistance = isMobile ? 50 : 100;
      const pos = generatePositions(words.length, rect.width, rect.height, minDistance);
      setPositions(pos);
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);
    return () => window.removeEventListener("resize", updatePositions);
  }, [words]);

  // ➕ Thêm từ mới
  const handleAddWord = async (e) => {
    e.preventDefault();
    if (!form.word.trim() || !form.createdBy.trim())
      return alert("Điền đủ thông tin!");

    const res = await fetch("/api/titleword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, titleId: id }),
    });

    if (res.ok) {
      setForm({ word: "", createdBy: "" });
      const newWords = await fetch(`/api/titleword?titleId=${id}`).then((r) =>
        r.json()
      );
      setWords(newWords);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div
        ref={containerRef}
        className="relative w-full h-[60vh] sm:h-[600px] bg-white border rounded-lg overflow-hidden flex items-center justify-center"
      >
        {/* Tiêu đề ở giữa */}
        {title && (
          <motion.h1
            layoutId="title"
            className="absolute text-xl sm:text-3xl font-bold text-center text-gray-800"
          >
            {title.name}
          </motion.h1>
        )}

        {/* Các từ */}
        {words.map((word, i) => (
          <motion.div
            key={word._id}
            className="absolute bg-blue-100 px-3 py-1 rounded-lg cursor-pointer text-sm shadow"
            style={{
              top: positions[i]?.y || 0,
              left: positions[i]?.x || 0,
            }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setSelectedWord(word)}
          >
            {word.word}
          </motion.div>
        ))}

        {/* Popup chi tiết */}
        {selectedWord && (
          <div
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
            onClick={() => setSelectedWord(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-[90%] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-2">{selectedWord.word}</h2>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Người tạo:</strong> {selectedWord.createdBy}
              </p>
              <button
                onClick={() => setSelectedWord(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* 📝 Form thêm từ */}
      <form
        onSubmit={handleAddWord}
        className="space-y-3 border p-4 rounded bg-gray-50 mt-6 max-w-md mx-auto shadow-sm"
      >
        <h2 className="text-lg font-semibold text-center">➕ Thêm từ mới</h2>
        <input
          placeholder="Từ khóa"
          value={form.word}
          onChange={(e) => setForm({ ...form, word: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          placeholder="Người tạo"
          value={form.createdBy}
          onChange={(e) => setForm({ ...form, createdBy: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full"
        >
          Lưu từ
        </button>
      </form>
    </div>
  );
}
