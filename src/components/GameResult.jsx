"use client";
export default function GameResult({ revealData }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 text-white flex flex-col items-center justify-center z-50 p-6">
      <h1 className="text-3xl font-bold mb-6">🎭 Kết thúc ván chơi!</h1>
      <ul className="space-y-3 max-w-md w-full">
        {revealData.map((p, i) => (
          <li
            key={i}
            className="flex justify-between p-3 rounded bg-white/10 border border-white/20"
          >
            <span>{p.name}</span>
            <span>
              {p.role === "whiteHat"
                ? "🕵️ Mũ trắng"
                : p.role === "spy"
                ? "🕶️ Gián điệp"
                : "👨‍🌾 Dân"}{" "}
              — <b>{p.keyword}</b>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-gray-300 text-sm italic">
        Tự động quay lại phòng chờ sau vài giây...
      </p>
    </div>
  );
}
