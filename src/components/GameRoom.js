"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GameRoom({ socket, role, keyword, players, roomCode }) {
  const [revealed, setRevealed] = useState(false);
  const [showRole, setShowRole] = useState(false);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    // Host sẽ được nhận khi tạo phòng
    socket.on("room_created", () => setIsHost(true));
    return () => socket.removeAllListeners("room_created");
  }, []);

  const startGame = () => {
    socket.emit("start_game", { roomCode });
  };

  const revealRole = () => {
    setRevealed(true);
    socket.emit("reveal_role", { roomCode, playerId: socket.id });
  };

  const endGame = () => {
    socket.emit("end_game", { roomCode });
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-lg">
      <h2 className="text-xl font-bold text-center mb-4">
        🕹 Phòng chơi: {roomCode}
      </h2>

      <div className="space-y-3 text-center">
        {role ? (
          <>
            <div className="text-lg font-semibold">
              Vai trò của bạn:{" "}
              <span
                className={
                  role === "whitehat" ? "text-red-500" : "text-green-600"
                }
              >
                {role === "whitehat" ? "Mũ trắng" : "Có từ khóa"}
              </span>
            </div>

            {role !== "whitehat" && (
              <div className="text-blue-600 text-lg font-medium">
                Từ khóa: <span className="font-bold">{keyword}</span>
              </div>
            )}

            {!revealed && (
              <Button onClick={revealRole} variant="destructive" className="mt-4">
                Lộ vai trò
              </Button>
            )}
          </>
        ) : (
          <p className="text-gray-500 italic">
            Chờ host bắt đầu trò chơi...
          </p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-center mb-2">👥 Người chơi</h3>
        <div className="grid grid-cols-2 gap-2">
          {players.map((p) => (
            <div
              key={p.id}
              className="bg-gray-100 rounded-xl p-2 text-center font-medium"
            >
              {p.name}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-6">
        {isHost && (
          <>
            <Button onClick={startGame}>Bắt đầu</Button>
            <Button variant="outline" onClick={endGame}>
              Kết thúc
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
