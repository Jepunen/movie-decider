// @vitest-environment jsdom
import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import VotingPage from "@/app/components/_components/_pages/VotingPage";
import type { CustomMovie } from "@/types/movies";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, animate, initial, exit, transition, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock("@/app/components/_components/_ui/Header", () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock("@/app/components/_components/MovieCard", () => ({
  default: ({ movie }: { movie: CustomMovie }) => (
    <div data-testid="movie-card">{movie.title}</div>
  ),
}));

vi.mock("@/app/components/_components/RateButton", () => ({
  default: ({ rate, onClick }: { rate: string; onClick: () => void }) => (
    <button data-testid={`rate-${rate}`} onClick={onClick}>
      {rate}
    </button>
  ),
}));

vi.mock("@/app/components/_components/Button", () => ({
  default: ({ children, onClick }: any) => (
    <button data-testid="skip-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

const makeMovie = (id: string, title: string): CustomMovie => ({
  title,
  description: "A great movie",
  poster_url: "/poster.jpg",
  release_date: "2020-01-01",
  runtime: "120 min",
  genres: [28],
  imdb_id: id,
  imdb_url: `https://imdb.com/title/${id}`,
  ratings: [],
  language: "en",
  director: "Director",
  actors: "Actor 1, Actor 2",
});

describe("VotingPage", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    );
    global.fetch = fetchMock as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state when movies is undefined", () => {
    render(
      <VotingPage
        movies={undefined}
        setResults={vi.fn()}
        onNavigate={vi.fn()}
        roomCode="ABC"
      />
    );
    expect(screen.getByText("Loading movies...")).toBeInTheDocument();
  });

  it("renders the current movie", () => {
    const movies = [makeMovie("tt001", "Inception"), makeMovie("tt002", "Matrix")];
    render(
      <VotingPage movies={movies} setResults={vi.fn()} onNavigate={vi.fn()} roomCode="ABC" />
    );
    expect(screen.getByText("Inception")).toBeInTheDocument();
  });

  it("renders all five rate buttons", () => {
    const movies = [makeMovie("tt001", "Inception")];
    render(
      <VotingPage movies={movies} setResults={vi.fn()} onNavigate={vi.fn()} roomCode="ABC" />
    );
    expect(screen.getByTestId("rate-worst")).toBeInTheDocument();
    expect(screen.getByTestId("rate-bad")).toBeInTheDocument();
    expect(screen.getByTestId("rate-normal")).toBeInTheDocument();
    expect(screen.getByTestId("rate-good")).toBeInTheDocument();
    expect(screen.getByTestId("rate-best")).toBeInTheDocument();
  });

  it("advances to the next movie after rating", async () => {
    const movies = [makeMovie("tt001", "Inception"), makeMovie("tt002", "Matrix")];
    render(
      <VotingPage movies={movies} setResults={vi.fn()} onNavigate={vi.fn()} roomCode="ABC" />
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId("rate-best"));
    });

    await waitFor(() => {
      expect(screen.getByText("Matrix")).toBeInTheDocument();
    });
  });

  it("POSTs vote to /api/score with correct payload", async () => {
    const movies = [makeMovie("tt001", "Inception"), makeMovie("tt002", "Matrix")];
    render(
      <VotingPage movies={movies} setResults={vi.fn()} onNavigate={vi.fn()} roomCode="ROOM1" />
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId("rate-good"));
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/score",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"score":"4"'),
      })
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.sessionID).toBe("ROOM1");
    expect(body.CustomMovie.imdb_id).toBe("tt001");
  });

  it("skips to next movie without calling API", async () => {
    const movies = [makeMovie("tt001", "Inception"), makeMovie("tt002", "Matrix")];
    render(
      <VotingPage movies={movies} setResults={vi.fn()} onNavigate={vi.fn()} roomCode="ABC" />
    );

    fireEvent.click(screen.getByTestId("skip-button"));

    expect(fetchMock).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText("Matrix")).toBeInTheDocument();
    });
  });

  it("calls onNavigate('results') after all movies are rated", async () => {
    const onNavigate = vi.fn();
    const movies = [makeMovie("tt001", "Inception")];
    render(
      <VotingPage movies={movies} setResults={vi.fn()} onNavigate={onNavigate} roomCode="ABC" />
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId("rate-best"));
    });

    await waitFor(() => {
      expect(onNavigate).toHaveBeenCalledWith("results");
    });
  });

  it("calls onNavigate('results') after all movies are skipped", async () => {
    const onNavigate = vi.fn();
    const movies = [makeMovie("tt001", "Inception")];
    render(
      <VotingPage movies={movies} setResults={vi.fn()} onNavigate={onNavigate} roomCode="ABC" />
    );

    fireEvent.click(screen.getByTestId("skip-button"));

    await waitFor(() => {
      expect(onNavigate).toHaveBeenCalledWith("results");
    });
  });
});
