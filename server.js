import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import next from "next";
import { Server } from "socket.io";
import Redis from "ioredis";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
	const httpServer = createServer(handler);

	const io = new Server(httpServer, {
		cors: {
			origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:3000"],
			methods: ["GET", "POST"],
		},
	});

	// Helper to broadcast player count to a session
	const broadcastPlayerCount = (sessionID) => {
		const room = io.sockets.adapter.rooms.get(sessionID);
		const count = room ? room.size : 0;
		//console.log(`👥 Session ${sessionID} has ${count} players`);
		io.to(sessionID).emit("player-count", { count });
	};

	io.on("connection", (socket) => {
		//console.log("✅ Client connected:", socket.id);

		socket.on("join-session", async (sessionID) => {
			//console.log(`🔵 JOIN-SESSION received from ${socket.id} for session ${sessionID}`);
			try {
				const sessionIDStr = String(sessionID);

				const subscriber = new Redis({
					host: process.env.REDIS_HOST,
					port: Number(process.env.REDIS_PORT),
				});

				const channelName = `session:${sessionID}:updates`;

				await subscriber.subscribe(channelName);
				socket.join(sessionIDStr);

				//console.log(`✅ Client ${socket.id} successfully joined session ${sessionID}`);

				subscriber.on("message", (channel, message) => {
					if (channel === channelName) {
						try {
							const data = JSON.parse(message);
							//console.log(`📤 Sending update to ${socket.id}:`, data);
							socket.emit("session-update", data);
						} catch (err) {
							//console.error("❌ Error parsing Redis message:", err);
						}
					}
				});

				socket.data.subscriber = subscriber;
				socket.data.sessionID = sessionIDStr;

				broadcastPlayerCount(sessionIDStr);

				// Fetch current session data to send to the newly joined client
				const sessionData = await new Redis({
					host: process.env.REDIS_HOST,
					port: Number(process.env.REDIS_PORT),
				}).get(`session:${sessionIDStr}`);

				if (sessionData) {
					try {
						const parsedData = JSON.parse(sessionData);
						socket.emit("session-update", parsedData);
					} catch (e) {
						console.error("Error parsing initial session data", e);
					}
				}

				socket.emit("joined-session", { sessionID });
			} catch (error) {
				//console.error("❌ Error joining session:", error);
				socket.emit("error", { message: "Failed to join session" });
			}
		});

		// ── Chat ────────────────────────────────────────────────────────────────
		// Client emits: { roomCode: string, senderName: string, text: string }
		// Server broadcasts to every socket in the room (including sender) so the
		// sender also receives confirmation that the message was delivered.
		socket.on("chat-message", ({ roomCode, senderName, text }) => {
			// Basic validation
			if (
				typeof roomCode !== "string" ||
				typeof senderName !== "string" ||
				typeof text !== "string" ||
				!text.trim() ||
				!senderName.trim() ||
				!roomCode.trim() ||
				text.length > 500 ||
				senderName.length > 20
			) {
				return;
			}

			// Only allow the socket to send messages to the room it joined
			if (socket.data.sessionID !== roomCode) {
				return;
			}

			const payload = {
				id: randomUUID(),
				senderId: socket.id,
				senderName: senderName.trim(),
				text: text.trim(),
				timestamp: Date.now(),
			};

			// Broadcast to every client in the room, including the sender
			io.to(roomCode).emit("chat-message", payload);
		});
		// ── End Chat ─────────────────────────────────────────────────────────────

		// ── Guest Genres ──────────────────────────────────────────────────────────────
		socket.on("guest-genres", async ({ sessionID, genres }) => {
/* 			console.log("📨 guest-genres received", { sessionID, genres, socketSessionID: socket.data.sessionID });

			console.log("📨 guest-genres received", { 
				sessionID, 
				sessionIDType: typeof sessionID,
				socketSessionID: socket.data.sessionID,
				socketSessionIDType: typeof socket.data.sessionID,
				match: socket.data.sessionID === sessionID
			}); */

			if (
				typeof sessionID !== "string" ||
				!Array.isArray(genres) ||
				!genres.every((g) => typeof g === "number")
			) {
				//console.log("❌ Validation failed");
				return;
			}

			if (socket.data.sessionID !== sessionID) {
				//console.log("❌ Session ID mismatch", { socketSession: socket.data.sessionID, received: sessionID });
				return;
			}

			const redis = new Redis({
				host: process.env.REDIS_HOST,
				port: Number(process.env.REDIS_PORT),
			});

			const key = `session:${sessionID}:genres:${socket.id}`;
			await redis.set(key, JSON.stringify(genres), "EX", 60 * 60);
			//console.log("✅ Stored guest genres in Redis", { key, genres });

			await redis.disconnect();
		});
		// ── End Guest Genres ──────────────────────────────────────────────────────────

		socket.on("disconnect", () => {
			//console.log("❌ Client disconnected:", socket.id);

			const sessionID = socket.data.sessionID;
			if (sessionID) {
				broadcastPlayerCount(sessionID);

				// Clean up this guest's genre preferences
				const redis = new Redis({
					host: process.env.REDIS_HOST,
					port: Number(process.env.REDIS_PORT),
				});
				redis.del(`session:${sessionID}:genres:${socket.id}`);
				redis.disconnect();
			}

			if (socket.data.subscriber) {
				socket.data.subscriber.disconnect();
			}
		});
	});

	httpServer
		.once("error", (err) => {
			console.error(err);
			process.exit(1);
		})
		.listen(port, () => {
			//console.log(`> Ready on http://${hostname}:${port}`);
		});
});
