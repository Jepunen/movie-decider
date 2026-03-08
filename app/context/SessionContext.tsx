"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { socket } from "@/app/socket";
import { CustomMovie, Result } from "@/types/movies";
import { GameMode, TournamentState } from "@/types/tournament";
import { useRouter } from "next/navigation";

interface SessionContextType {
  isConnected: boolean;
  socketId: string | undefined;
  roomCode: string | null;
  playerCount: number;
  movies: CustomMovie[];
  results: Result[];
  sessionState: boolean; // false = waiting/creating, true = voting/results
  gameMode: GameMode | null;
  tournamentState: TournamentState | null;
  joinSession: (code: string) => void;
  createSession: () => Promise<string | null>;
  startGame: () => void;
  submitVotes: (votes: any) => void;
  setRoomCode: (code: string) => void;
  setMovies: (movies: CustomMovie[]) => void;
  isLoading: boolean;
  error: string | null;
  sessionJoined: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | undefined>(undefined);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [movies, setMoviesState] = useState<CustomMovie[]>([]);
  const [results, setResultsState] = useState<Result[]>([]);
  const [sessionState, setSessionState] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [tournamentState, setTournamentState] = useState<TournamentState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionJoined, setSessionJoined] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Socket event listeners
    function onConnect() {
      setIsConnected(true);
      setSocketId(socket.id);
      setIsLoading(false);
    }

    function onDisconnect() {
      setIsConnected(false);
      setSocketId(undefined);
    }

    function onJoinedSession(data: { sessionID: string }) {
      setRoomCode(data.sessionID);
	  setSessionJoined(true);
      setIsLoading(false);
    }

    function onPlayerCount(data: { count: number }) {
      setPlayerCount(data.count);
    }

    function onSessionUpdate(data: any) {
      if (data.sessionState !== undefined) setSessionState(data.sessionState);
      if (data.movies) setMoviesState(Object.values(data.movies));
      if (data.results) setResultsState(data.results);
      if (data.currentMovies) setMoviesState(data.currentMovies);
      if (data.gameMode) setGameMode(data.gameMode as GameMode);

      // Parse tournament state — expose only the client-facing fields
      if (data.tournament) {
        setTournamentState({
          status: data.tournament.status,
          roundIndex: data.tournament.roundIndex,
          pairs: data.tournament.pairs ?? [],
          rankings: data.tournament.rankings,
        });
      }
    }

    function onError(err: any) {
      console.error("Socket error:", err);
      setError(err.message || "An unknown error occurred");
      setIsLoading(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("joined-session", onJoinedSession);
    socket.on("player-count", onPlayerCount);
    socket.on("session-update", onSessionUpdate);
    socket.on("error", onError);

    // If we're already connected (e.g. from a previous page or HMR), update state
    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("joined-session", onJoinedSession);
      socket.off("player-count", onPlayerCount);
      socket.off("session-update", onSessionUpdate);
      socket.off("error", onError);
    };
  }, []);

  const joinSession = (code: string) => {
    setIsLoading(true);
    setError(null);
    if (!socket.connected) {
      socket.connect();
    }
    // We emit join-session. The server will reply with joined-session or error.
    // If not connected yet, the emit happens after connect? 
    // socket.io buffers emits if not connected? usually yes, but explicit connect is safer.

    // We can't emit until connected.
    if (socket.connected) {
      socket.emit("join-session", code);
    } else {
      socket.once('connect', () => {
        socket.emit("join-session", code);
      });
    }
  };

  const createSession = async (): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/session/create", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.sessionID) {
        const id = data.sessionID.toString();
        joinSession(id);
        return id;
      } else {
        throw new Error(data.message || "Failed to create session");
      }
    } catch (e: any) {
      setError(e.message);
      setIsLoading(false);
      return null;
    }
  };

  const startGame = () => {
    // Game is started via /api/start-game from CreatePage
  };

  const submitVotes = (votes: any) => {
    // Implement voting logic
  };

  return (
    <SessionContext.Provider
      value={{
        isConnected,
        socketId,
        roomCode,
        playerCount,
        movies,
        results,
        sessionState,
        gameMode,
        tournamentState,
        joinSession,
        createSession,
        startGame,
        submitVotes,
        setRoomCode,
        setMovies: setMoviesState,
        isLoading,
        error,
		sessionJoined,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
