"use client";
import { useState } from "react";

export default function AddSentencePage() {
  const [sentence, setSentence] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/sentences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: sentence }),
    });

    if (res.ok) {
      setSentence("");
      alert("✅ Sentence saved!");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-xl p-6">
      <h1 className="text-2xl font-bold mb-4 text-indigo-600">➕ Add Sentence</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Enter your sentence..."
          required
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
