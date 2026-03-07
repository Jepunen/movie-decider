import type { CustomMovie } from "./movies";

// ─── Game Mode ──────────────────────────────────────────────────────
export type GameMode = "classic" | "tournament";

// ─── Tournament Round Labels ────────────────────────────────────────
export type TournamentRoundLabel = "Quarterfinal" | "Semifinal" | "Final";

// ─── A single 1v1 matchup ──────────────────────────────────────────
export type TournamentPair = [CustomMovie, CustomMovie];

// ─── Tournament round status from the backend ───────────────────────
// "voting"  → pairs are active, users are picking winners
// "waiting" → current user finished this round, waiting for others
// "complete"→ all rounds done, results are ready
export type TournamentStatus = "voting" | "waiting" | "complete";

// ─── Full tournament state pushed via socket "session-update" ───────
// BACKEND DEV: Publish this shape inside the session-update payload
// whenever tournament state changes. The frontend reads it from
// SessionContext and renders accordingly.
export type TournamentState = {
  status: TournamentStatus;
  /** 0-based round index: 0 = Quarterfinal, 1 = Semifinal, 2 = Final */
  roundIndex: number;
  /** The pairs for the CURRENT round that this user needs to vote on */
  pairs: TournamentPair[];
  /** Final 1st→8th ranking. Only populated when status === "complete" */
  rankings?: TournamentRanking[];
};

// ─── Final ranking entry ────────────────────────────────────────────
export type TournamentRanking = {
  /** 1-based placement (1 = winner, 2 = runner-up, etc.) */
  place: number;
  movie: CustomMovie;
  /** How many rounds the movie survived (max 3 for winner) */
  roundsWon: number;
};

// ─── Request body: submit a single pair vote ────────────────────────
// POST /api/tournament/vote
// BACKEND DEV: Accept this payload. Look up the session's current
// tournament round. Record which movie this user picked as the winner
// for this pair. Once ALL users in the session have voted on ALL pairs
// in the current round, resolve winners, build the next round's pairs,
// and publish an updated TournamentState via session-update socket event.
export type TournamentVoteRequest = {
  sessionID: string;
  roundIndex: number;
  pairIndex: number;
  /** imdb_id of the chosen movie */
  winnerImdbId: string;
};

// ─── Response body from vote endpoint ───────────────────────────────
export type TournamentVoteResponse = {
  success: boolean;
  message?: string;
};
