"use client";
import { useEffect, useState } from "react";

export default function AddTitlePage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [listTitles, setListTitles] = useState([]);

  // Lấy danh sách title
  const fetchTitles = async () => {
    const res = await fetch("/api/title");
    const data = await res.json();
    setListTitles(data);
  };

  useEffect(() => {
    fetchTitles();
  }, []);

  // Thêm title mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Vui lòng nhập tên title");

    const res = await fetch("/api/title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setMessage("✅ Thêm title thành công!");
      setName("");
      fetchTitles(); // load lại danh sách
    } else {
      setMessage("❌ Có lỗi xảy ra!");
    }
  };

  // Xóa title
  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa title này không?")) return;

    const res = await fetch(`/api/title/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setMessage("🗑️ Xóa title thành công!");
      setListTitles((prev) => prev.filter((t) => t._id !== id));
    } else {
      setMessage("❌ Không thể xóa title!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-semibold text-center">Thêm Title mới</h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input
          placeholder="Tên title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Thêm
        </button>
      </form>

      {message && <p className="text-green-600 text-center">{message}</p>}

      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          Danh sách Title hiện có:
        </h2>
        <ul className="space-y-2">
          {listTitles.map((title) => (
            <li
              key={title._id}
              className="flex justify-between items-center border p-2 rounded hover:bg-gray-50"
            >
              <span className="text-gray-800">{title.name}</span>
              <button
                onClick={() => handleDelete(title._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
