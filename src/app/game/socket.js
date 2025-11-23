import { io } from "socket.io-client";
const socket = io("https://backend-mc-production-d9ec.up.railway.app", {
  transports: ["websocket"], // 🔒 Ưu tiên WebSocket, ổn định hơn long-polling
  secure: true, // ✅ Bắt buộc SSL (https)
  autoConnect: true, // ✅ Tự động kết nối khi import
  reconnection: true, // 🔁 Cho phép reconnect
  reconnectionAttempts: 10, // Thử lại 10 lần
  reconnectionDelay: 1000, // Mỗi lần chờ 1 giây
  timeout: 10000, // Ngắt sau 10s nếu không kết nối được
});
// Đổi sang server thật khi deploy
export default socket;
