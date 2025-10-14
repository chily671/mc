"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function JoinPanel({ socket, setScreen }) {
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");

  const joinRoom = () => {
    if (!roomCode || !playerName) return alert("Vui lòng nhập đủ thông tin");
    socket.emit("join_room", { roomCode, playerName });
    setScreen("game");
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-sm space-y-4">
      <h2 className="text-xl font-bold text-center">🎮 Tham gia phòng</h2>

      <Input
        placeholder="Mã phòng (VD: ABCD)"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
      />
      <Input
        placeholder="Tên hiển thị"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />

      <Button onClick={joinRoom} className="w-full">
        Vào phòng
      </Button>

      <Button
        variant="secondary"
        onClick={() => setScreen("menu")}
        className="w-full"
      >
        Quay lại
      </Button>
    </div>
  );
}
