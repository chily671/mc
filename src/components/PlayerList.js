"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function PlayerList({ socket, roomCode }) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!socket || !roomCode) return;

    // Nhận danh sách người chơi từ server
    socket.on("players_update", (playerList) => {
      setPlayers(playerList);
    });

    // cleanup
    return () => {
      socket.off("players_update");
    };
  }, [socket, roomCode]);

  return (
    <Card className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-md">
      <CardHeader>
        <h2 className="text-lg font-bold text-center text-gray-800">
          👥 Danh sách người chơi trong phòng
        </h2>
        <p className="text-sm text-center text-gray-500">
          Mã phòng: <span className="font-semibold text-blue-600">{roomCode}</span>
        </p>
      </CardHeader>
      <CardContent>
        {players.length === 0 ? (
          <p className="text-gray-500 text-center italic">
            Chưa có ai trong phòng...
          </p>
        ) : (
          <ul className="space-y-2">
            {players.map((player) => (
              <li
                key={player.id}
                className="flex justify-between items-center p-2 border border-gray-100 bg-gray-50 rounded-md"
              >
                <span className="text-gray-700">{player.name}</span>
                <span className="text-xs text-gray-400">
                  {player.id.slice(0, 4)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
