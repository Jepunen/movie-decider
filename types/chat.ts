/**
 * Represents a single chat message.
 *
 * Backend integration notes:
 * - `id`         — unique identifier, e.g. crypto.randomUUID() on the server
 * - `senderId`   — the sender's socket.id (set by the server)
 * - `senderName` — the display name chosen by the user
 * - `text`       — message body
 * - `timestamp`  — Unix ms timestamp (Date.now() on the server)
 * - `isOwn`      — derived on the client by comparing senderId to socket.id; never sent over the wire
 */
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isOwn?: boolean;
}

/**
 * Payload the client emits when sending a message.
 *
 * Socket event: "chat-message" (emit)
 *   client → server
 */
export interface SendChatMessagePayload {
  roomCode: string;
  senderName: string;
  text: string;
}

/**
 * Payload the server broadcasts to all room members when a message is sent.
 *
 * Socket event: "chat-message" (listen)
 *   server → all clients in room
 *
 * Backend: after receiving "chat-message", validate the payload, then:
 *   socket.to(roomCode).emit("chat-message", broadcastPayload);
 *   socket.emit("chat-message", broadcastPayload); // also send back to sender
 */
export interface ReceiveChatMessagePayload {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}
