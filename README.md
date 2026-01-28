# Movie Decider

Movie Decider is a collaborative web app for groups to quickly decide on a movie to watch together. Users can create or join a session, vote on movies, and see the best match for the group based on preferences and ratings.

This project was part of a React Hackathon course by Twoday & LUT University.

## Features

- **Create or Join Sessions:** Start a new movie night or join an existing one with a room code.
- **Genre Selection:** Choose your favorite genres to personalize recommendations.
- **Movie Voting:** Swipe or rate movies to express your preferences.
- **Real-Time Updates:** See votes and results update live with WebSockets.
- **Compatibility Results:** Get a movie suggestion that best fits the group’s tastes.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes, Node.js
- **Real-Time:** Socket.io
- **Database/Cache:** Redis

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)
- Redis server (for local development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Jepunen/movie-decider.git
   cd movie-decider
   ```
2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```
3. Start Redis locally (if not already running)

4. Run the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` — Next.js app directory (pages, API routes, components)
- `lib/` — Shared libraries (e.g., movie data, providers)
- `redis/` — Redis connection utilities
- `types/` — TypeScript type definitions
- `public/` — Static assets (movie posters, images)
