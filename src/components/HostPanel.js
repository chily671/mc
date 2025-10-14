"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HostPanel({ socket, setScreen }) {
  const [keyword, setKeyword] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(6);

  const createRoom = () => {
    const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    socket.emit("create_room", { roomCode, keyword, maxPlayers });
    setScreen("join");
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md space-y-3">
      <Input
        placeholder="Nhập từ khóa"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Số người chơi"
        value={maxPlayers}
        onChange={(e) => setMaxPlayers(e.target.value)}
      />
      <Button onClick={createRoom}>Tạo phòng</Button>
    </div>
  );
}
