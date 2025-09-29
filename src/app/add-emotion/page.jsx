"use client";
import { useState } from "react";

export default function AddEmotionPage() {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/emotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, icon }),
    });

    if (res.ok) {
      setName("");
      setIcon("");
      alert("✅ Emotion saved!");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-xl p-6">
      <h1 className="text-2xl font-bold mb-4 text-indigo-600">➕ Add Emotion</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Emotion name (Happy, Sad...)"
          required
        />
        <input
          type="text"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Emoji (😊)"
        />
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600"
        >
          Save
        </button>
      </form>
    </div>
  );
}
