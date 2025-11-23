"use client";
export default function RoleDisplay({ role, keyword }) {
  if (!role) return null;
  return (
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
  );
}
