# Join Session API Usage

## Joining an Existing Session

### 1. Join a Session (Client-side)

```typescript
// Join an existing session
const response = await fetch("/api/session/join", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		sessionID: "123456",
	}),
});

const data = await response.json();

if (response.ok) {
	////console.log('Session found:', data.sessionID);
	////console.log('Session data:', data.sessionData);
	// Now connect to WebSocket with this sessionID
} else {
	console.error("Failed to join:", data.message);
}
```

### 2. Connect to WebSocket After Joining

```typescript
import { io } from "socket.io-client";

// After successfully joining via API, connect to WebSocket
const socket = io();

// Join the session via WebSocket
socket.emit("join-session", sessionID);

// Listen for session updates
socket.on("session-update", (data) => {
	////console.log('Session updated:', data);
	// Update your UI with the new data
});

// Listen for join confirmation
socket.on("joined-session", ({ sessionID }) => {
	////console.log('Successfully joined session via WebSocket:', sessionID);
});

// Handle errors
socket.on("error", ({ message }) => {
	console.error("Socket error:", message);
});
```

## API Endpoint

### POST /api/session/join

Validates that a session exists in Redis before allowing WebSocket connection.

**Request Body:**

```json
{
	"sessionID": "123456"
}
```

**Success Response (200):**

```json
{
	"sessionID": "123456",
	"message": "Session found. You can now connect via WebSocket.",
	"sessionData": {
		"createdAt": "2026-01-22T12:00:00.000Z",
		"movies": [],
		"participants": []
	}
}
```

**Error Responses:**

**400 Bad Request** - Missing sessionID:

```json
{
	"message": "sessionID is required"
}
```

**404 Not Found** - Session doesn't exist or has expired:

```json
{
	"message": "Session not found or has expired"
}
```

**500 Internal Server Error:**

```json
{
	"message": "Failed to join session"
}
```

## Complete Flow Example

```typescript
async function joinSession(sessionID: string) {
	try {
		// Step 1: Validate session exists
		const response = await fetch("/api/session/join", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ sessionID }),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message);
		}

		const { sessionData } = await response.json();

		// Step 2: Connect to WebSocket
		const socket = io();

		socket.emit("join-session", sessionID);

		socket.on("joined-session", () => {
			////console.log('Connected to session!');
		});

		socket.on("session-update", (data) => {
			// Handle real-time updates
			////console.log('Update received:', data);
		});

		return { socket, sessionData };
	} catch (error) {
		console.error("Failed to join session:", error);
		throw error;
	}
}

// Usage
const { socket, sessionData } = await joinSession("123456");
```
