"use client";
import { useState } from "react";

export default function PracticePage() {
  const [sentence, setSentence] = useState(null);
  const [emotion, setEmotion] = useState(null);

  const getRandomSentence = async () => {
    const res = await fetch("/api/sentences");
    const data = await res.json();
    if (data.length > 0) {
      const random = data[Math.floor(Math.random() * data.length)];
      setSentence(random.text);
    }
  };

  const getRandomEmotion = async () => {
    const res = await fetch("/api/emotions");
    const data = await res.json();
    if (data.length > 0) {
      const random = data[Math.floor(Math.random() * data.length)];
      setEmotion(`${random.icon || ""} ${random.name}`);
    }
  };

  const getRandomBoth = async () => {
    await getRandomSentence();
    await getRandomEmotion();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-600">🎯 Practice</h1>

      <button
        onClick={getRandomBoth}
        className="w-full bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
      >
        Random Sentence + Emotion
      </button>

      {sentence && (
        <p className="mt-4 text-xl">📝 {sentence}</p>
      )}
      {emotion && (
        <p className="text-lg text-indigo-600">Emotion: {emotion}</p>
      )}
    </div>
  );
}
