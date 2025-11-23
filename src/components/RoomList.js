"use client";
import { useEffect, useState } from "react";
import socket from "../app/game/socket";

export default function RoomsList({ onJoin }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.emit("get_rooms");
    socket.on("room_list", setRooms);
    socket.on("room_list_update", setRooms);

    return () => {
      socket.off("room_list");
      socket.off("room_list_update");
    };
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="font-bold text-lg mb-2">🧩 Danh sách phòng hiện tại</h2>
      {rooms.length === 0 ? (
        <p>Chưa có phòng nào</p>
      ) : (
        <ul className="space-y-2">
          {rooms.map((r) => (
            <li
              key={r.code}
              onClick={() => !r.started && onJoin(r.code)}
              className={`flex justify-between items-center border p-2 rounded cursor-pointer ${
                r.started
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              <span>
                <b>{r.code}</b> — Host: {r.host}
              </span>
              <span>
                👥 {r.playerCount} người {r.started && " (Đang chơi)"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
