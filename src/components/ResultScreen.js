"use client";
import { Button } from "@/components/ui/button";

export default function ResultScreen({ players }) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-md text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        🎉 Kết quả trò chơi
      </h2>

      <ul className="space-y-2">
        {players.map((p, i) => (
          <li
            key={i}
            className="bg-gray-100 rounded-xl py-2 font-medium text-gray-800"
          >
            {p.name}
          </li>
        ))}
      </ul>

      <Button
        onClick={() => (window.location.href = "/game")}
        className="mt-6"
      >
        Chơi lại
      </Button>
    </div>
  );
}
