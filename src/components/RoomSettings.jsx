"use client";
export default function RoomSettings({
  settings,
  handleCountChange,
  handleKeywordChange,
  startGame,
  endGame,
}) {
  return (
    <>
      <div className="bg-white shadow-md rounded-2xl border border-gray-200 p-4">
        <h3 className="text-center text-lg font-semibold mb-2">⚙️ Cài đặt phòng</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {["villagers", "spies", "whiteHats"].map((key) => (
            <div key={key}>
              <label className="text-sm text-gray-600">
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
                className="border p-1 w-full rounded text-center"
              />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {Object.entries(settings.keywords).map(([key, val]) => (
            <input
              key={key}
              placeholder={`Từ khóa cho ${key}`}
              className="border w-full p-2 rounded"
              value={val}
              onChange={(e) => handleKeywordChange(key, e.target.value)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-3">
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
    </>
  );
}
