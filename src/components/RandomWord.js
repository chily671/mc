"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaRandom } from "react-icons/fa";

export default function RandomWord({ words }) {
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const handleRandom = () => {
    setSpinning(true);
    setResult(null);

    setTimeout(() => {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setResult(randomWord);
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        key={result || "?"}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-extrabold px-8 py-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg text-white text-center min-w-[200px]"
      >
        {spinning ? "🔄 Đang quay..." : result || "❓"}
      </motion.div>

      <button
        onClick={handleRandom}
        disabled={spinning}
        className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white shadow-md transition-all ${
          spinning
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-pink-500 hover:bg-pink-600"
        }`}
      >
        <FaRandom />
        {spinning ? "Đang quay..." : "Random 🎲"}
      </button>
    </div>
  );
}
