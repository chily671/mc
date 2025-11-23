"use client";
import { useState, useEffect } from "react";
import socket from "./socket";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import RoomsList from "@/components/RoomList";
import RoleDisplay from "@/components/RoleDisplay";

export default function GamePage() {
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState([]);
  const [role, setRole] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [inRoom, setInRoom] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [revealData, setRevealData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [settings, setSettings] = useState({
    villagers: 3,
    spies: 1,
    whiteHats: 1,
    keywords: { villager: "", spy: "", whiteHat: "" },
  });

  // 🆔 Lấy hoặc tạo userId
  useEffect(() => {
    let savedId = localStorage.getItem("userId");
    if (!savedId) {
      savedId = crypto.randomUUID();
      localStorage.setItem("userId", savedId);
    }
    setUserId(savedId);
  }, []);

  // 🎧 Socket listeners
  useEffect(() => {
    if (!userId) return;

    const handleRoomCreated = (code) => {
      setRoomCode(code);
      localStorage.setItem("roomCode", code);
      setInRoom(true); // đã vào phòng
      setIsHost(true); // người tạo phòng = host
    };

    const handlePlayersUpdate = (data) => {
      setPlayers(data);
    };

    const handleRoleAssigned = ({ role, keyword }) => {
      setRole(role);
      setKeyword(keyword);
    };

    const handleSettingsUpdated = (data) => setSettings(data);

    const handleGameStarted = () => {
      // Không xóa gameData
      console.log("Game đã bắt đầu!");
    };

    const handleGameEnded = (data) => {
      setRevealData(data);
      setTimeout(() => {
        setRevealData(null);
        setRole(null);
        setKeyword(null);
        setGameData(null);
      }, 6000);
    };

    const handleGamePlaying = (data) => setGameData(data);

    const handleError = (msg) => alert(msg);

    const handleJoinedSuccess = ({ roomCode, host }) => {
      setRoomCode(roomCode);
      localStorage.setItem("roomCode", roomCode);
      setInRoom(true);
      setIsHost(false);
    };

    const handleReconnectSuccess = () => {
      setInRoom(true);
    };

    const handleConnect = () => {
      const savedRoom = localStorage.getItem("roomCode");
      if (savedRoom && userId) {
        socket.emit("reconnect_room", { roomCode: savedRoom, userId });
      }
    };

    socket.on("room_created", handleRoomCreated);
    socket.on("players_update", handlePlayersUpdate);
    socket.on("role_assigned", handleRoleAssigned);
    socket.on("settings_updated", handleSettingsUpdated);
    socket.on("game_started", handleGameStarted);
    socket.on("game_ended", handleGameEnded);
    socket.on("game_playing", handleGamePlaying);
    socket.on("error_message", handleError);
    socket.on("joined_success", handleJoinedSuccess);
    socket.on("reconnected_success", handleReconnectSuccess);
    socket.on("connect", handleConnect);
    socket.on("room_deleted", (data) => {
      alert(data.message);
      router.push("/"); // hoặc load trang lobby
    });
    socket.on("kicked", (msg) => {
      alert(msg);
      setInRoom(false);
      setIsHost(false);
      setRoomCode("");
      setPlayers([]);
    });
    socket.on("all_roles", (allPlayers) => {
      if (allPlayers && allPlayers.length) {
        setGameData(allPlayers);
      }
    });

    return () => {
      socket.off("room_created", handleRoomCreated);
      socket.off("players_update", handlePlayersUpdate);
      socket.off("role_assigned", handleRoleAssigned);
      socket.off("settings_updated", handleSettingsUpdated);
      socket.off("game_started", handleGameStarted);
      socket.off("game_ended", handleGameEnded);
      socket.off("game_playing", handleGamePlaying);
      socket.off("error_message", handleError);
      socket.off("joined_success", handleJoinedSuccess);
      socket.off("reconnected_success", handleReconnectSuccess);
      socket.off("connect", handleConnect);
    };
  }, [userId]);

  const handleKick = (playerId) => {
    if (!roomCode || !isHost) return;
    if (confirm("Bạn có chắc muốn kick người chơi này không?")) {
      socket.emit("kick_player", {
        roomCode,
        hostId: userId, // đây là userId của host
        playerId, // người bị kick
      });
    }
  };

  // 🏠 Room actions
  const createRoom = () => {
    if (!playerName.trim()) return alert("Nhập tên của bạn trước!");
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    socket.emit("create_room", {
      roomCode: code,
      hostName: playerName,
      userId,
    });
    localStorage.setItem("playerName", playerName);
  };

  const joinRoom = () => {
    if (!playerName.trim() || !roomCode.trim())
      return alert("Điền đủ thông tin!");
    socket.emit("join_room", { roomCode, playerName, userId });
  };

  const handleJoinRoom = (code) => {
    const name = prompt("Nhập tên của bạn:") || "Người chơi";
    socket.emit("join_room", { roomCode: code, playerName: name, userId });
  };

  const updateSettings = (newSettings) => {
    const merged = {
      ...settings,
      ...newSettings,
      keywords: { ...settings.keywords, ...(newSettings.keywords || {}) },
    };
    setSettings(merged);
    socket.emit("update_settings", { roomCode, userId, newSettings: merged });
  };

  const startGame = () => socket.emit("start_game", { roomCode, userId });
  const endGame = () => socket.emit("end_game", { roomCode, userId });

  const handleCountChange = (key, value) =>
    updateSettings({ [key]: Math.max(0, parseInt(value) || 0) });

  const handleKeywordChange = (key, value) =>
    updateSettings({ keywords: { ...settings.keywords, [key]: value } });

  // 💥 Game ended UI
  if (revealData) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 text-white flex flex-col items-center justify-center z-50 p-6">
        <h1 className="text-4xl font-extrabold mb-6 animate-pulse">
          🎭 Kết thúc ván chơi!
        </h1>
        <ul className="space-y-3 max-w-md w-full">
          {revealData.map((p, i) => (
            <li
              key={i}
              className="flex justify-between p-4 rounded-xl bg-white/20 border border-white/30 backdrop-blur-md shadow-md"
            >
              <span className="font-semibold">{p.name}</span>
              <span className="font-medium">
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
        <p className="mt-6 text-gray-300 text-sm italic animate-pulse">
          Tự động quay lại phòng chờ sau vài giây...
        </p>
      </div>
    );
  }

  // 🎮 Main UI
  return (
    <div className="p-6 min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      {!inRoom ? (
        <div className="space-y-4 w-full max-w-sm bg-gradient-to-br from-yellow-50 via-yellow-100 to-white p-6 rounded-3xl shadow-lg border border-yellow-200">
          <h1 className="text-3xl font-bold text-yellow-800 text-center animate-pulse">
            🎮 Người Mũ Trắng
          </h1>
          <input
            placeholder="Tên của bạn"
            className="border w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <input
            placeholder="Mã phòng (nếu có)"
            className="border w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <div className="flex justify-center gap-4">
            <button
              onClick={createRoom}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Tạo phòng
            </button>
            <button
              onClick={joinRoom}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Vào phòng
            </button>
          </div>
          <RoomsList onJoin={handleJoinRoom} />
        </div>
      ) : (
        <div className="w-full max-w-md space-y-4">
          {/* Room info */}
          <Card className="bg-white shadow-xl rounded-3xl border border-gray-200">
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-800 text-center">
                🏠 Phòng: <span className="text-yellow-600">{roomCode}</span>
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
                      className={`flex justify-between items-center p-3 rounded-xl border ${
                        p.status === "offline"
                          ? "bg-red-100 border-red-300 text-red-700"
                          : "bg-green-50 border-green-200 text-green-800"
                      } shadow-sm transition-colors`}
                    >
                      <div>
                        <span className="font-semibold">{p.name}</span>
                        <span className="text-xs ml-2 italic">
                          #{i + 1} {p.role === "host" ? "(Host)" : ""}
                          {p.status === "offline" ? " (Offline)" : ""}
                        </span>
                      </div>
                      {isHost && p.role !== "host" && (
                        <button
                          onClick={() => handleKick(p.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Kick
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end mb-3">
            <button
              onClick={() => {
                socket.emit("leave_room", { roomCode, userId });
                localStorage.removeItem("roomCode");
                setInRoom(false);
                setIsHost(false);
                setRole(null);
                setKeyword(null);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-xl shadow-lg"
            >
              🚪 Thoát phòng
            </button>
          </div>

          {isHost && (
            <>
              <Card className="bg-white shadow-xl rounded-3xl border border-gray-200 p-4">
                <h3 className="text-center text-lg font-semibold mb-2">
                  ⚙️ Cài đặt phòng
                </h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {["villagers", "spies", "whiteHats"].map((key) => (
                    <div key={key}>
                      <label className="text-sm text-gray-600 font-medium">
                        {key === "villagers"
                          ? "Dân"
                          : key === "spies"
                          ? "Gián điệp"
                          : "Mũ trắng"}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={settings[key]}
                        onChange={(e) => handleCountChange(key, e.target.value)}
                        className="border p-1 w-full rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>
                  ))}
                </div>
                {["villager", "spy", "whiteHat"].map((key) => (
                  <input
                    key={key}
                    placeholder={`Từ khóa cho ${key}`}
                    className="border w-full p-2 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={settings.keywords[key]}
                    onChange={(e) => handleKeywordChange(key, e.target.value)}
                  />
                ))}
              </Card>

              <div className="flex justify-center gap-3 mt-2">
                <button
                  onClick={startGame}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-xl shadow-lg transition-transform transform hover:scale-105"
                >
                  Bắt đầu
                </button>
                <button
                  onClick={endGame}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl shadow-lg transition-transform transform hover:scale-105"
                >
                  Kết thúc
                </button>
              </div>
              <RoleDisplay role={role} keyword={keyword} />
              <ul className="space-y-3 max-w-md w-full mt-4">
                {gameData &&
                  gameData.map((p, i) => (
                    <li
                      key={i}
                      className="flex justify-between p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 shadow-sm"
                    >
                      <span className="font-medium">{p.name}</span>
                      <span className="font-medium">
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
            </>
          )}

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
