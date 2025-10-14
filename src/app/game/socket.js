    import { io } from "socket.io-client";
    const socket = io("https://backend-mc-production-d9ec.up.railway.app"); // Đổi sang server thật khi deploy
    export default socket;
