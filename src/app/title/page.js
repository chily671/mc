"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function TitleListPage() {
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    const fetchTitles = async () => {
      const res = await fetch("/api/title");
      const data = await res.json();
      setTitles(data);
    };
    fetchTitles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        📚 Danh sách Chủ đề
      </h1>
      <p className="text-center mb-6 text-gray-600">
        Được dựa trên ý tưởng trò chơi đã được giao lưu với anh Hải Linh trong
        buổi gặp mặt ngày 13/10/2025. Đây là mục tổng hợp các hướng tiếp cận
        cho một chủ đề. Mong rằng các bạn sẽ hưởng ứng và góp phần làm phong phú
        cho các nội dung{" "}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {titles.map((title) => (
          <Link
            key={title._id}
            href={`/title/${title._id}`}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center border border-gray-200 hover:border-blue-400"
          >
            <h2 className="font-semibold text-gray-800">{title.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
