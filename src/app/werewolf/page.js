"use client";
import { useState } from "react";

export default function WerewolfPage() {
  const [players, setPlayers] = useState([]);
  const [playerCount, setPlayerCount] = useState(6);
  const [gameStarted, setGameStarted] = useState(false);

  const roles = [
    "Werewolf",
    "Werewolf",
    "Villager",
    "Villager",
    "Seer",
    "Hunter",
  ];

  const startGame = () => {
    const shuffled = [...roles].sort(() => Math.random() - 0.5);
    const newPlayers = Array.from({ length: playerCount }, (_, i) => ({
      id: i + 1,
      name: `Player ${i + 1}`,
      role: shuffled[i] || "Villager",
      revealed: false,
    }));
    setPlayers(newPlayers);
    setGameStarted(true);
  };

  const toggleReveal = (id) => {
    setPlayers(
      players.map((p) => (p.id === id ? { ...p, revealed: !p.revealed } : p)),
    );
  };

  const resetGame = () => {
    setPlayers([]);
    setGameStarted(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🐺 Werewolf Game</h1>

      {!gameStarted ? (
        <div>
          <label>
            Number of Players:
            <input
              type="number"
              min="4"
              max="10"
              value={playerCount}
              onChange={(e) => setPlayerCount(Number(e.target.value))}
              style={{ marginLeft: "10px", padding: "5px" }}
            />
          </label>
          <button
            onClick={startGame}
            style={{
              marginLeft: "10px",
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Start Game
          </button>
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            {players.map((player) => (
              <div
                key={player.id}
                onClick={() => toggleReveal(player.id)}
                style={{
                  padding: "15px",
                  border: "2px solid #333",
                  borderRadius: "8px",
                  backgroundColor: player.revealed ? "#ffecb3" : "#e0e0e0",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                <p style={{ margin: "0 0 10px" }}>{player.name}</p>
                <p style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
                  {player.revealed ? player.role : "?"}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={resetGame}
            style={{
              marginTop: "20px",
              padding: "8px 16px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            New Game
          </button>
        </div>
      )}
    </div>
  );
}
