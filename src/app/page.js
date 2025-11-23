import Link from "next/link";

export default function Dashboard() {
  const menu = [
    { href: "/words-random", label: "🗣️ Luyện tập từ" },
    { href: "/word-frames", label: "📚 Sổ tay từ vựng" },
    { href: "/title", label: "📝 Chủ đề và hướng tiếp cận" },
    { href: "/game", label: "🎮 Người Mũ Trắng" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-10 text-gray-800">
        📊 luyện tập MC
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition text-center text-lg font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
