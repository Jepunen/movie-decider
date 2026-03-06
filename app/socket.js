"use client";

import { io } from "socket.io-client";

export const socket = io({
    autoConnect: false,
});

socket.on("connect", () => {
    //console.log("✅ WebSocket connected:", socket.id);
});

socket.on("disconnect", () => {
    //console.log("❌ WebSocket disconnected");
});

socket.on("error", (error) => {
    //console.error("❌ Socket error:", error);
});
