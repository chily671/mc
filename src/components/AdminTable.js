"use client";
import { useState, useEffect } from "react";

export default function AdminTable({ title, placeholder, api }) {
  const [items, setItems] = useState([]);
  console.log("🚀 ~ AdminTable ~ items:", items)
  const [input, setInput] = useState("");

  // Load data
  useEffect(() => {
    fetch(api)
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, [api]);

  const handleAdd = async () => {
    if (input.trim() === "") return;
    const res = await fetch(api, {
      method: "POST",
      body: JSON.stringify({ text: input.trim() }),
    });
    const newItem = await res.json();
    setItems([...items, newItem]);
    setInput("");
  };

  const handleDelete = async (id) => {
    await fetch(api, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    setItems(items.filter((item) => item._id !== id));
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 w-full">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>

      {/* Input add item */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg"
        >
          Add
        </button>
      </div>

      {/* List items */}
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item._id}
            className="flex justify-between items-center px-3 py-2 bg-white/20 rounded-lg text-white"
          >
            <span>{item.text || item.word || item.name}</span>
            <button
              onClick={() => handleDelete(item._id)}
              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-sm rounded-md"
            >
              Delete
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-gray-300 italic">Chưa có dữ liệu</li>
        )}
      </ul>
    </div>
  );
}
