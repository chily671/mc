"use client";
import { useState, useEffect } from "react";
import socket from "./socket";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function GamePage() {
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState([]);
  const [role, setRole] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [inRoom, setInRoom] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [revealData, setRevealData] = useState(null); // 👈 lưu kết quả cuối game

  const [settings, setSettings] = useState({
    villagers: 3,
    spies: 1,
    whiteHats: 1,
    keywords: { villager: "", spy: "", whiteHat: "" },
  });

  // 🔊 Lắng nghe sự kiện từ server
  useEffect(() => {
    socket.on("players_update", setPlayers);
    socket.on("role_assigned", ({ role, keyword }) => {
      setRole(role);
      setKeyword(keyword);
    });
    socket.on("settings_updated", (data) => setSettings(data));
    socket.on("game_started", () => console.log("Game started!"));

    // Khi game kết thúc, server gửi toàn bộ danh sách role + keyword
    socket.on("game_ended", (data) => {
      setRevealData(data); // Lưu để hiển thị toàn màn hình
      setTimeout(() => {
        // Sau vài giây, quay lại phòng chờ
        setRevealData(null);
        setRole(null);
        setKeyword(null);
        setInRoom(true);
      }, 6000);
    });

    return () => {
      socket.off("players_update");
      socket.off("role_assigned");
      socket.off("settings_updated");
      socket.off("game_started");
      socket.off("game_ended");
    };
  }, []);

  // 🏠 Tạo phòng
  const createRoom = () => {
    if (!playerName.trim()) return alert("Nhập tên của bạn trước!");
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    socket.emit("create_room", { roomCode: code, hostName: playerName });
    setRoomCode(code);
    setInRoom(true);
    setIsHost(true);
  };

  // 👥 Vào phòng
  const joinRoom = () => {
    if (!playerName.trim() || !roomCode.trim()) return alert("Điền đủ thông tin!");
    socket.emit("join_room", { roomCode, playerName });
    setInRoom(true);
  };

  // ⚙️ Cập nhật cài đặt
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    socket.emit("update_settings", { roomCode, newSettings: { ...settings, ...newSettings } });
  };

  // ▶️ Bắt đầu & 🏁 Kết thúc
  const startGame = () => socket.emit("start_game", { roomCode });
  const endGame = () => socket.emit("end_game", { roomCode });

  // 🧮 Input thay đổi
  const handleCountChange = (key, value) => {
    const v = Math.max(0, parseInt(value) || 0);
    updateSettings({ [key]: v });
  };

  const handleKeywordChange = (key, value) => {
    updateSettings({ keywords: { ...settings.keywords, [key]: value } });
  };

  // 💥 Toàn màn hình hiển thị vai trò khi game kết thúc
  if (revealData) {
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

  // Giao diện chính
  return (
    <div className="p-6 min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {!inRoom ? (
        <div className="space-y-4 w-full max-w-sm bg-white p-6 rounded-2xl shadow">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            🎮 Trò chơi Người Mũ Trắng
          </h1>

          <input
            placeholder="Tên của bạn"
            className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <input
            placeholder="Mã phòng (nếu có)"
            className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />

          <div className="flex justify-center gap-4">
            <button
              onClick={createRoom}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
            >
              Tạo phòng
            </button>
            <button
              onClick={joinRoom}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow"
            >
              Vào phòng
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-4">
          <Card className="bg-white shadow-md rounded-2xl border border-gray-200">
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-800 text-center">
                🏠 Phòng: <span className="text-blue-600">{roomCode}</span>
              </h2>
            </CardHeader>

            <CardContent>
              {players.length === 0 ? (
                <p className="text-center text-gray-500 italic">
                  Chưa có ai trong phòng...
                </p>
              ) : (
                <ul className="space-y-2">
                  {players.map((p, i) => (
                    <li
                      key={p.id}
                      className="flex justify-between items-center p-2 border border-gray-100 bg-gray-50 rounded-md"
                    >
                      <span className="text-gray-700">{p.name}</span>
                      <span className="text-xs text-gray-400">
                        #{i + 1} {p.role === "host" ? "(Host)" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* ⚙️ Chỉ host mới thấy phần này */}
          {isHost && (
            <Card className="bg-white shadow-md rounded-2xl border border-gray-200 p-4">
              <h3 className="text-center text-lg font-semibold mb-2">⚙️ Cài đặt phòng</h3>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div>
                  <label className="text-sm text-gray-600">Dân</label>
                  <input
                    type="number"
                    min="0"
                    value={settings.villagers}
                    onChange={(e) => handleCountChange("villagers", e.target.value)}
                    className="border p-1 w-full rounded text-center"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Gián điệp</label>
                  <input
                    type="number"
                    min="0"
                    value={settings.spies}
                    onChange={(e) => handleCountChange("spies", e.target.value)}
                    className="border p-1 w-full rounded text-center"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Mũ trắng</label>
                  <input
                    type="number"
                    min="0"
                    value={settings.whiteHats}
                    onChange={(e) => handleCountChange("whiteHats", e.target.value)}
                    className="border p-1 w-full rounded text-center"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <input
                  placeholder="Từ khóa cho dân"
                  className="border w-full p-2 rounded"
                  value={settings.keywords.villager}
                  onChange={(e) => handleKeywordChange("villager", e.target.value)}
                />
                <input
                  placeholder="Từ khóa cho gián điệp"
                  className="border w-full p-2 rounded"
                  value={settings.keywords.spy}
                  onChange={(e) => handleKeywordChange("spy", e.target.value)}
                />
                <input
                  placeholder="Từ khóa cho mũ trắng"
                  className="border w-full p-2 rounded"
                  value={settings.keywords.whiteHat}
                  onChange={(e) => handleKeywordChange("whiteHat", e.target.value)}
                />
              </div>
            </Card>
          )}

          {/* 🎮 Nút điều khiển */}
          {isHost && (
            <div className="flex justify-center gap-3">
              <button
                onClick={startGame}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow"
              >
                Bắt đầu
              </button>
              <button
                onClick={endGame}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
              >
                Kết thúc
              </button>
            </div>
          )}

          {/* 🧩 Vai trò người chơi */}
          {role && (
            <div className="text-center mt-6">
              <p className="text-lg">
                Vai trò:{" "}
                <b
                  className={
                    role === "whiteHat"
                      ? "text-blue-600"
                      : role === "spy"
                      ? "text-red-600"
                      : "text-green-600"
                  }
                >
                  {role === "whiteHat"
                    ? "Mũ trắng 🕵️"
                    : role === "spy"
                    ? "Gián điệp 🕶️"
                    : "Người dân 👨‍🌾"}
                </b>
              </p>
              {keyword && (
                <p className="text-gray-700 mt-2">
                  Từ khóa: <b>{keyword}</b>
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
