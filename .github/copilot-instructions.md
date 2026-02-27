# Copilot Instructions — Movie Decider

## Project Overview

Movie Decider is a real-time multiplayer movie voting app. Users create or join rooms via 6-digit codes, vote on movies (1–5 scale), and see ranked results by compatibility. The stack is **Next.js 16 (App Router) + React 19 + Socket.io + Redis + Tailwind CSS v4**.

## Tech Stack

- **Runtime:** Node.js with ESM (`"type": "module"`)
- **Framework:** Next.js 16 App Router with a custom HTTP server (`server.js`) that hosts both Next.js and Socket.io on port 3000
- **Language:** TypeScript (strict mode). `server.js` and `app/socket.js` are plain JS
- **Package manager:** pnpm
- **Styling:** Tailwind CSS v4 (utility classes inline, no CSS modules)
- **State management:** React Context (`SessionContext`) + Socket.io for real-time sync
- **Data fetching:** React Query (`@tanstack/react-query`) for client-side caching, Next.js `fetch` with `next.revalidate` for server-side caching
- **Animations:** Framer Motion (`motion.*`, `AnimatePresence`, `layoutId`) and `react-card-flip`
- **UI primitives:** Headless UI (`Dialog`, `Transition`)
- **Database:** Redis via `ioredis` (session data with 1-hour TTL, pub/sub for real-time updates)
- **External APIs:** TMDB (discover + movie details) and OMDB (ratings, director, actors)

## Project Structure

```
server.js               # Custom Node HTTP server (Next.js + Socket.io)
app/
  socket.js             # Singleton Socket.io client (autoConnect: false)
  layout.tsx            # Root layout: ReactQueryProvider → SessionProvider → GlobalLoader → children
  context/
    SessionContext.tsx   # Session state, socket events, room management
  api/                  # Next.js Route Handlers (Web Request/Response API)
    session/            # create, join, updateScore
    movies/             # GET — fetches from TMDB + OMDB
    score/              # POST — submit votes, calculate results
    start-game/         # POST — transitions session to voting state
  components/
    _components/        # Shared components (Button, MovieCard, RoomCode, etc.)
      _pages/           # Full presentational page components (HomePage, VotingPage, etc.)
      _ui/              # Atomic UI primitives (Header)
    _MovieCard/         # MovieCard sub-components
    _ResultCard/        # ResultCard sub-components
    _GenreSelector/     # GenreSelector sub-components
  constants/            # Static data (genre list with TMDB IDs)
  create/ join/ vote/ waiting/ results/  # Route pages (thin client wrappers)
lib/
  movies.ts             # TMDB/OMDB fetching pipeline, useMovies hook
  providers.tsx         # React Query provider setup
redis/
  redis.ts              # Redis singleton, session CRUD helpers, pub/sub
types/
  movies.ts             # Movie, CustomMovie, Result, DiscoverMovieParams
  redisData.ts          # redisData, redisMovieData, updateScoreType
  screen.ts             # Screen union type
```

## Architecture Patterns

### Page → Presentational Component Pattern
Route pages (`app/create/page.tsx`, etc.) are thin `"use client"` wrappers that:
1. Read URL query params via `useSearchParams()` (wrapped in `<Suspense>`)
2. Pull session state from `useSession()` context
3. Call `joinSession(code)` if needed
4. Define a `handleNavigate` callback mapping screen names to `router.push()` calls
5. Render the corresponding page component from `_pages/` with props

### Real-Time Data Flow
1. API routes mutate session data in Redis via `updateSessionData()`
2. `updateSessionData()` publishes to a Redis pub/sub channel (`session:{id}:updates`)
3. The custom server's per-socket Redis subscriber receives the message
4. Server forwards it as a `"session-update"` Socket.io event to the client
5. `SessionContext` handles the event and updates React state

### Movie Fetching Pipeline
TMDB Discover → pick 10 random movies → TMDB Details (get IMDB ID) → OMDB enrichment (ratings, cast) → `CustomMovie[]`. Concurrency limited to 5 via `p-limit`.

## Coding Conventions

### General
- Use **tab indentation**
- Use **TypeScript** for all new code (except `server.js` and `socket.js`)
- Use **strict mode** TypeScript
- Import with the `@/` path alias (maps to project root)
- Use **ESM** imports (`import`/`export`, not `require`)
- **Default exports** for components, **named exports** for sub-components and utilities

### Components
- **PascalCase** filenames for all components
- Props interfaces named `{ComponentName}Props`, defined in the same file
- Underscore-prefixed folders (`_ComponentName/`) group sub-components belonging to a parent
- Use `"use client"` directive only on components that need client-side features
- Prefer **function declarations** over arrow functions for components
- Use `forwardRef` when the component needs to expose a ref (e.g., Button)

### Styling
- **Tailwind CSS v4** utility classes inline — no CSS modules or styled-components
- Custom theme colors are defined as CSS custom properties in `globals.css` and mapped via the `@theme` block
- Use the project's custom utilities where appropriate: `.glass`, `.glass-card`, `.text-gradient`
- Dark theme color palette: Deep Slate (background), Electric Violet (primary), Sky Blue (secondary), Rose (accent)

### API Routes
- Use Next.js Route Handlers with the Web `Request`/`Response` APIs
- Export named async functions matching HTTP methods (`GET`, `POST`)
- Parse JSON request bodies, interact with Redis, return `Response.json()`
- No middleware pattern

### Types
- Domain types use **PascalCase** (`CustomMovie`, `Result`, `Movie`)
- Redis-specific types use **camelCase** (`redisData`, `redisMovieData`)
- All types live in `types/`

## Environment Variables

```
TMDB_BASE_URL    # TMDB API base URL
TMDB_API_KEY     # TMDB API key (Bearer token)
OMDB_API_KEY     # OMDB API key
REDIS_HOST       # Redis server host
REDIS_PORT       # Redis server port
```

## Commands

- `pnpm dev` — Start dev server (runs `node server.js`)
- `pnpm build` — Build for production (`next build`)
- `pnpm start` — Start production server (`NODE_ENV=production node server.js`)
- `pnpm lint` — Run ESLint
