# Copilot Instructions for Movie Decider (NextMovie)

## Project Overview

A multiplayer movie selection web app where users create/join sessions, vote on movies together, and see combined results. Built with real-time communication for synchronized voting experiences.

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Runtime:** React 19, TypeScript
- **Styling:** Tailwind CSS v4 with custom theme colors
- **Real-time:** Socket.io (client + server)
- **Database:** Redis (ioredis) for session storage and pub/sub
- **Data Fetching:** TanStack React Query
- **Animations:** Framer Motion
- **Package Manager:** pnpm

## Project Structure

```
app/
├── api/                    # Next.js API routes
├── components/
│   └── _components/
│       ├── _pages/         # Page-level components (HomePage, VotingPage, etc.)
│       ├── _ui/            # Reusable UI components
│       └── [Component].tsx # Feature components
│   └── _[ComponentName]/   # Component-specific sub-components
├── constants/              # App constants (genres, etc.)
lib/                        # Utility functions and providers
redis/                      # Redis connection and helpers
types/                      # TypeScript type definitions
server.js                   # Custom Node.js server with Socket.io
```

## Code Conventions

### Components

- Use `"use client"` directive for client components requiring hooks/interactivity
- Define props interfaces directly above component declarations
- Use functional components with TypeScript
- Naming: PascalCase for components, camelCase for functions/variables

```tsx
interface ComponentProps {
  propName: string;
  onAction: (value: string) => void;
}

export default function Component({ propName, onAction }: ComponentProps) {
  // ...
}
```

### API Routes

- Located in `app/api/[route]/route.ts`
- Use Next.js Response.json() for responses
- Handle Redis connection status before operations
- Include proper error handling with try/catch

```typescript
export async function POST(req: Request) {
  try {
    const redis = getRedis();
    if (redis.status !== "ready") {
      await redis.connect();
    }
    // ... logic
    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Error" }, { status: 500 });
  }
}
```

### Redis Patterns

- Use `getRedis()` singleton from `@/redis/redis`
- Session keys follow pattern: `session:${sessionID}`
- Pub/sub channels: `session:${sessionID}:updates`
- Sessions expire after 1 hour (3600 seconds)

### Socket.io Events

- Client connects via `socket.connect()` from `@/app/socket`
- Key events: `join-session`, `session-update`, `player-count`
- Server broadcasts updates via Redis pub/sub

## Styling

- Use Tailwind CSS utility classes
- Custom theme colors defined in `globals.css`:
  - `--color-primary: #222831` (dark background)
  - `--color-secondary: #393E46`
  - `--color-accent: #FFD369` (yellow accent)
  - `--color-text: #EEEEEE`
- Use Geist fonts (`--font-geist-sans`, `--font-geist-mono`)

## Type Definitions

- Movie types in `types/movies.ts` (CustomMovie, Movie, OMDBMovie, etc.)
- Redis data types in `types/redisData.ts`
- Screen navigation type in `types/screen.ts`

## External APIs

- **TMDB API:** Movie discovery and details (`process.env.TMDB_BASE_URL`, `process.env.TMDB_API_KEY`)
- **OMDB API:** Additional movie ratings and metadata

## Development

```bash
pnpm dev      # Start dev server (runs server.js)
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Environment Variables

Required:
- `REDIS_HOST` - Redis server hostname
- `REDIS_PORT` - Redis server port
- `TMDB_BASE_URL` - TMDB API base URL
- `TMDB_API_KEY` - TMDB API bearer token
