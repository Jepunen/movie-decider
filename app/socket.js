"use client";

import { io } from "socket.io-client";

// Initialize socket but don't auto-connect
export const socket = io({
	autoConnect: false, // We'll connect manually
});

// Add connection event listeners for debugging
socket.on("connect", () => {
	////console.log("✅ WebSocket connected:", socket.id);
});

socket.on("disconnect", () => {
	////console.log("❌ WebSocket disconnected");
});

socket.on("joined-session", (data) => {
	////console.log("✅ Joined session:", data.sessionID);
});

socket.on("error", (error) => {
	console.error("❌ Socket error:", error);
});
