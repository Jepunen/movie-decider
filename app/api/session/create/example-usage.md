# Session API Usage

## Creating a Session and Connecting via WebSocket

### 1. Create a Session (Client-side)

```typescript
// Create a new session
const response = await fetch('/api/session/create', {
  method: 'POST',
});

const { sessionID } = await response.json();
console.log('Session created:', sessionID);
```

### 2. Connect to WebSocket (Client-side)

```typescript
import { io } from 'socket.io-client';

// Connect to the WebSocket server
const socket = io();

// Join the session
socket.emit('join-session', sessionID);

// Listen for session updates
socket.on('session-update', (data) => {
  console.log('Session updated:', data);
  // Update your UI with the new data
});

// Listen for join confirmation
socket.on('joined-session', ({ sessionID }) => {
  console.log('Successfully joined session:', sessionID);
});

// Handle errors
socket.on('error', ({ message }) => {
  console.error('Socket error:', message);
});

// Clean up on unmount
return () => {
  socket.disconnect();
};
```

### 3. Publishing Updates to a Session (Backend)

```typescript
import { updateSessionData } from '@/redis/redis';

// When you want to update the session and notify all connected clients
await updateSessionData(sessionID, {
  createdAt: existingData.createdAt,
  movies: [...existingData.movies, newMovie],
  participants: existingData.participants,
});
```

## API Endpoints

### POST /api/session/create

Creates a new session and stores it in Redis.

**Response:**
```json
{
  "sessionID": "123456",
  "message": "Session created successfully"
}
```

## WebSocket Events

### Client → Server

- `join-session`: Join a session by sessionID
  ```typescript
  socket.emit('join-session', sessionID);
  ```

### Server → Client

- `joined-session`: Confirmation of joining a session
- `session-update`: Real-time updates when session data changes
- `error`: Error messages

## Redis Schema

### Session Key Format
- Key: `session:{sessionID}`
- Value: JSON string with session data
- TTL: 24 hours (86400 seconds)

### Pub/Sub Channel Format
- Channel: `session:{sessionID}:updates`
- Messages: JSON string with updated session data

## Example Session Data Structure

```json
{
  "createdAt": "2026-01-22T12:00:00.000Z",
  "movies": [
    { "id": 1, "title": "Movie 1", "votes": 5 }
  ],
  "participants": ["user1", "user2"]
}
```
