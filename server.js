import { createServer } from "node:http";
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
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Handle session join
    socket.on("join-session", async (sessionID) => {
      try {
        // Create a Redis subscriber for this session
        const subscriber = new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        });

        const channelName = `session:${sessionID}:updates`;
        
        // Subscribe to the session's Redis channel
        await subscriber.subscribe(channelName);
        
        socket.join(sessionID);
        console.log(`Client ${socket.id} joined session ${sessionID}`);

        // Listen for Redis messages and forward to the socket
        subscriber.on("message", (channel, message) => {
          if (channel === channelName) {
            try {
              const data = JSON.parse(message);
              socket.emit("session-update", data);
            } catch (err) {
              console.error("Error parsing Redis message:", err);
            }
          }
        });

        // Store subscriber reference for cleanup
        socket.data.subscriber = subscriber;
        socket.data.sessionID = sessionID;

        // Send confirmation
        socket.emit("joined-session", { sessionID });
      } catch (error) {
        console.error("Error joining session:", error);
        socket.emit("error", { message: "Failed to join session" });
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      
      // Clean up Redis subscriber
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
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});