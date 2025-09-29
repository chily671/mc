"use client";
import { useState } from "react";

export default function RandomWord() {
  const [loading, setLoading] = useState(false);
  const [word, setWord] = useState(null);
  const [setName, setSetName] = useState("default");

  const handleRandom = async () => {
    setLoading(true);
    setWord(null);

    try {
      const res = await fetch(`/api/random-word?set=${setName}`);
      const data = await res.json();

      setTimeout(() => {
        if (data.word) {
          setWord(data.word);
        } else {
          setWord(data.message || "⚠️ Không tìm thấy từ");
        }
        setLoading(false);
      }, 1200);
    } catch (error) {
      setWord("❌ Lỗi khi lấy dữ liệu");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-96 text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">🎲 Random Word</h2>

        {/* Chọn bộ */}
        <select
          value={setName}
          onChange={(e) => setSetName(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        >
          <option value="default">Default</option>
          <option value="set1">Set 1</option>
          <option value="set2">Set 2</option>
        </select>

        {loading && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-500">Đang random...</p>
          </div>
        )}

        {!loading && word && (
          <div className="mt-4 text-3xl font-bold text-indigo-600">{word}</div>
        )}

        <button
          onClick={handleRandom}
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition"
        >
          {loading ? "Đang quay..." : "Random Ngay"}
        </button>
      </div>
    </div>
  );
}
