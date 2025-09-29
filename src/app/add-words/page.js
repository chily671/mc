"use client";
import { useState } from "react";
import { toast } from "sonner";

export default function AddWordPage() {
  const [word, setWord] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/words", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: word }),
    });
    if (res.ok) {
      setWord("");
      toast.success("Word added successfully!");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-xl p-6">
      <h1 className="text-2xl font-bold mb-4 text-indigo-600">➕ Add Word</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="e.g. Confidence"
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
