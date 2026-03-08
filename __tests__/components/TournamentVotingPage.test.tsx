// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import TournamentVotingPage from "@/app/components/_components/_pages/TournamentVotingPage";
import type { CustomMovie } from "@/types/movies";
import type { TournamentPair } from "@/types/tournament";

vi.mock("@/app/socket", () => ({
  socket: {
    id: "socket-abc",
    connected: true,
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, animate, initial, exit, transition, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));

vi.mock("@/app/components/_components/_ui/Header", () => ({
  default: () => <header>Header</header>,
}));

// Simplified card — exposes pick button keyed by imdb_id
vi.mock("@/app/components/_components/TournamentMovieCard", () => ({
  default: ({ movie, onPick, disabled, isSelected, isEliminated }: any) => (
    <div data-testid={`card-${movie.imdb_id}`}>
      <span>{movie.title}</span>
      <button
        onClick={onPick}
        disabled={disabled}
        data-testid={`pick-${movie.imdb_id}`}
      >
        Choose
      </button>
      {isSelected && <span data-testid={`selected-${movie.imdb_id}`}>Selected</span>}
      {isEliminated && <span data-testid={`eliminated-${movie.imdb_id}`}>Eliminated</span>}
    </div>
  ),
}));

vi.mock("@/app/components/_components/TournamentRoundWaiting", () => ({
  default: ({ roundLabel, playerCount }: any) => (
    <div data-testid="round-waiting">
      <p>{roundLabel} complete</p>
      <p>{playerCount} players</p>
    </div>
  ),
}));

// ─── Helpers ────────────────────────────────────────────────────────────────

const makeMovie = (id: string, title: string): CustomMovie => ({
  title,
  description: "Test movie",
  poster_url: "/poster.jpg",
  release_date: "2020-01-01",
  runtime: "120 min",
  genres: [28],
  imdb_id: id,
  imdb_url: `https://imdb.com/title/${id}`,
  ratings: [],
  language: "en",
  director: "Director",
  actors: "Actor",
});

const movie1 = makeMovie("tt001", "Inception");
const movie2 = makeMovie("tt002", "Matrix");
const movie3 = makeMovie("tt003", "Interstellar");
const movie4 = makeMovie("tt004", "Dark Knight");

const quarterfinalPairs: TournamentPair[] = [
  [movie1, movie2],
  [movie3, movie4],
];

const defaultProps = {
  roomCode: "ROOM1",
  pairs: quarterfinalPairs,
  roundIndex: 0,
  status: "voting" as const,
  playerCount: 2,
  voterSocketId: "voter-123",
  onNavigate: vi.fn(),
};

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("TournamentVotingPage", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    );
    global.fetch = fetchMock as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe("Round labels", () => {
    it("shows 'Quarterfinal' for roundIndex 0", () => {
      render(<TournamentVotingPage {...defaultProps} roundIndex={0} />);
      expect(screen.getByText("Quarterfinal")).toBeInTheDocument();
    });

    it("shows 'Semifinal' for roundIndex 1", () => {
      render(
        <TournamentVotingPage {...defaultProps} roundIndex={1} pairs={[[movie1, movie2]]} />
      );
      expect(screen.getByText("Semifinal")).toBeInTheDocument();
    });

    it("shows 'Final' for roundIndex 2", () => {
      render(
        <TournamentVotingPage {...defaultProps} roundIndex={2} pairs={[[movie1, movie2]]} />
      );
      expect(screen.getByText("Final")).toBeInTheDocument();
    });
  });

  describe("Pair progress display", () => {
    it("shows current pair index and total pairs", () => {
      render(<TournamentVotingPage {...defaultProps} />);
      expect(screen.getByText(/Pair 1 \/ 2/)).toBeInTheDocument();
    });

    it("renders both movie cards for the first pair", () => {
      render(<TournamentVotingPage {...defaultProps} />);
      expect(screen.getByText("Inception")).toBeInTheDocument();
      expect(screen.getByText("Matrix")).toBeInTheDocument();
    });
  });

  describe("Waiting state", () => {
    it("shows waiting screen when status is 'waiting'", () => {
      render(<TournamentVotingPage {...defaultProps} status="waiting" />);
      expect(screen.getByTestId("round-waiting")).toBeInTheDocument();
    });

    it("shows waiting screen after all pairs in a round are voted on", async () => {
      vi.useFakeTimers();
      render(<TournamentVotingPage {...defaultProps} pairs={[[movie1, movie2]]} />);

      fireEvent.click(screen.getByTestId("pick-tt001"));
      // Advance past the 700ms animation delay + fetch + 300ms exit animation
      await vi.advanceTimersByTimeAsync(700);
      await vi.advanceTimersByTimeAsync(300);
      await act(async () => {});

      expect(screen.getByTestId("round-waiting")).toBeInTheDocument();
    });
  });

  describe("Tournament complete", () => {
    it("calls onNavigate with 'results' and roomCode when status is 'complete'", () => {
      const onNavigate = vi.fn();
      render(<TournamentVotingPage {...defaultProps} status="complete" onNavigate={onNavigate} />);
      expect(onNavigate).toHaveBeenCalledWith("results", "ROOM1");
    });
  });

  describe("Voting interaction", () => {
    it("submits vote to /api/tournament/vote with correct payload", async () => {
      vi.useFakeTimers();
      render(<TournamentVotingPage {...defaultProps} />);

      fireEvent.click(screen.getByTestId("pick-tt001"));
      await vi.advanceTimersByTimeAsync(700);

      expect(fetchMock).toHaveBeenCalledWith(
        "/api/tournament/vote",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"winnerImdbId":"tt001"'),
        })
      );
      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.sessionID).toBe("ROOM1");
      expect(body.roundIndex).toBe(0);
      expect(body.pairIndex).toBe(0);
    });

    it("shows winner as selected and loser as eliminated immediately after pick", async () => {
      // selectedId is set synchronously before the 700ms delay — real timers fine here
      render(<TournamentVotingPage {...defaultProps} />);

      fireEvent.click(screen.getByTestId("pick-tt001"));
      // Flush React's batched state updates (selectedId, isSubmitting set before setTimeout)
      await act(async () => { await Promise.resolve(); });

      expect(screen.getByTestId("selected-tt001")).toBeInTheDocument();
      expect(screen.getByTestId("eliminated-tt002")).toBeInTheDocument();
    });

    it("disables pick buttons while vote is submitting", async () => {
      // isSubmitting is set synchronously before the 700ms delay — real timers fine here
      render(<TournamentVotingPage {...defaultProps} />);

      fireEvent.click(screen.getByTestId("pick-tt001"));
      await act(async () => { await Promise.resolve(); });

      expect(screen.getByTestId("pick-tt001")).toBeDisabled();
      expect(screen.getByTestId("pick-tt002")).toBeDisabled();
    });

    it("advances to second pair after first vote completes", async () => {
      vi.useFakeTimers();
      render(<TournamentVotingPage {...defaultProps} />);

      fireEvent.click(screen.getByTestId("pick-tt001"));
      await vi.advanceTimersByTimeAsync(700);
      await vi.advanceTimersByTimeAsync(300);
      await act(async () => {});

      expect(screen.getByText(/Pair 2 \/ 2/)).toBeInTheDocument();
    });
  });
});
