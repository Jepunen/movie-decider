// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GenreSelector from "@/app/components/_components/GenreSelector";
import { genres } from "@/app/constants/genres";

vi.mock("framer-motion", () => ({
  motion: {
    button: React.forwardRef(function MotionButton(
      { children, whileHover, whileTap, animate, initial, exit, transition, ...props }: any,
      ref: any
    ) {
      return (
        <button ref={ref} {...props}>
          {children}
        </button>
      );
    }),
    div: ({ children, animate, initial, exit, transition, whileHover, whileTap, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("GenreSelector", () => {
  it("renders all genre buttons", () => {
    render(<GenreSelector />);
    for (const genre of genres) {
      expect(screen.getByText(genre.name)).toBeInTheDocument();
    }
  });

  it("renders the correct number of genre buttons", () => {
    render(<GenreSelector />);
    expect(screen.getAllByRole("button")).toHaveLength(genres.length);
  });

  it("calls onChange with genre id when unselected button is clicked", () => {
    const onChange = vi.fn();
    render(<GenreSelector onChange={onChange} selected={[]} />);

    fireEvent.click(screen.getByText("Action"));

    expect(onChange).toHaveBeenCalledWith([28]);
  });

  it("calls onChange removing genre when already-selected button is clicked", () => {
    const onChange = vi.fn();
    render(<GenreSelector onChange={onChange} selected={[28]} />);

    fireEvent.click(screen.getByText("Action"));

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("appends new genre to existing selection", () => {
    const onChange = vi.fn();
    render(<GenreSelector onChange={onChange} selected={[28]} />);

    fireEvent.click(screen.getByText("Comedy"));

    expect(onChange).toHaveBeenCalledWith([28, 35]);
  });

  it("does not crash without onChange prop", () => {
    render(<GenreSelector selected={[]} />);
    fireEvent.click(screen.getByText("Action")); // should not throw
  });
});
