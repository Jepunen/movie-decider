// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import WaitingPage from "@/app/components/_components/_pages/WaitingPage";

const mockEmit = vi.hoisted(() => vi.fn());

vi.mock("@/app/socket", () => ({
  socket: {
    connected: true,
    id: "test-socket-id",
    emit: mockEmit,
    on: vi.fn(),
    off: vi.fn(),
  },
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, animate, initial, exit, transition, layoutId, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, animate, initial, exit, transition, whileHover, whileTap, ...props }: any) => (
      <button {...props}>{children}</button>
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

// Mock YearRangeSelector — CSS import and slider internals not relevant here
vi.mock("@/app/components/_components/YearRangeSelector", () => ({
  default: ({ onChange }: any) => (
    <div data-testid="year-range-selector">
      <button data-testid="change-year" onClick={() => onChange([1990, 2020])}>
        Change Year Range
      </button>
    </div>
  ),
}));

// Mock GenreSelector — tested in isolation in GenreSelector.test.tsx
vi.mock("@/app/components/_components/GenreSelector", () => ({
  default: ({ onChange }: any) => (
    <div data-testid="genre-selector">
      <button data-testid="toggle-genre" onClick={() => onChange([28])}>
        Toggle Action
      </button>
    </div>
  ),
}));

const defaultProps = {
  onNavigate: vi.fn(),
  roomCode: "TEST1",
  playerCount: 1,
  sessionJoined: true,
};

describe("WaitingPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders player count in singular", () => {
    render(<WaitingPage {...defaultProps} playerCount={1} />);
    expect(screen.getByText("1 player")).toBeInTheDocument();
  });

  it("renders player count in plural", () => {
    render(<WaitingPage {...defaultProps} playerCount={3} />);
    expect(screen.getByText("3 players")).toBeInTheDocument();
  });

  it("shows waiting room message by default", () => {
    render(<WaitingPage {...defaultProps} />);
    expect(screen.getByText("Wait for host to start the game!")).toBeInTheDocument();
  });

  it("shows 'Waiting Room' and 'Preferences' tabs", () => {
    render(<WaitingPage {...defaultProps} />);
    expect(screen.getByText("Waiting Room")).toBeInTheDocument();
    expect(screen.getByText("Preferences")).toBeInTheDocument();
  });

  it("switches to preferences view showing genre and year selectors", () => {
    render(<WaitingPage {...defaultProps} />);

    fireEvent.click(screen.getByText("Preferences"));

    expect(screen.getByText("Set your movie preferences!")).toBeInTheDocument();
    expect(screen.getByTestId("genre-selector")).toBeInTheDocument();
    expect(screen.getByTestId("year-range-selector")).toBeInTheDocument();
  });

  it("emits guest-genres socket event on mount when sessionJoined is true", () => {
    render(<WaitingPage {...defaultProps} />);
    expect(mockEmit).toHaveBeenCalledWith(
      "guest-genres",
      expect.objectContaining({ sessionID: "TEST1" })
    );
  });

  it("does not emit socket event when sessionJoined is false", () => {
    render(<WaitingPage {...defaultProps} sessionJoined={false} />);
    expect(mockEmit).not.toHaveBeenCalled();
  });

  it("emits socket event with updated yearRange when year range changes", async () => {
    render(<WaitingPage {...defaultProps} />);

    fireEvent.click(screen.getByText("Preferences"));
    mockEmit.mockClear();

    await act(async () => {
      fireEvent.click(screen.getByTestId("change-year"));
    });

    expect(mockEmit).toHaveBeenCalledWith(
      "guest-genres",
      expect.objectContaining({
        sessionID: "TEST1",
        yearRange: [1990, 2020],
      })
    );
  });

  it("emits socket event with updated genres when genre selection changes", async () => {
    render(<WaitingPage {...defaultProps} />);

    fireEvent.click(screen.getByText("Preferences"));
    mockEmit.mockClear();

    await act(async () => {
      fireEvent.click(screen.getByTestId("toggle-genre"));
    });

    expect(mockEmit).toHaveBeenCalledWith(
      "guest-genres",
      expect.objectContaining({
        sessionID: "TEST1",
        genres: [28],
      })
    );
  });
});
