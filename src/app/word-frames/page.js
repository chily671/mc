"use client";
import { useEffect, useState } from "react";

export default function WordFrames() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    fetch("/api/words")
      .then((res) => res.json())
      .then((data) => setWords(data));
  }, []);

  // Gom từ theo category
  const groupedWords = words.reduce((acc, w) => {
    const category = w.category || "Khác";
    if (!acc[category]) acc[category] = [];
    acc[category].push(w);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        📚 Sổ tay từ vựng
      </h1>

      {Object.keys(groupedWords).map((cat) => (
        <div key={cat} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            {cat}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {groupedWords[cat].map((w) => (
              <div
                key={w._id}
                className="p-4 bg-blue-100 rounded-xl text-center font-semibold hover:bg-blue-200 transition"
              >
                {w.word}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
