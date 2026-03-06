import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Button from "./Button";
import { renderWithProviders } from "@/test/renderWithProviders";

describe("Button", () => {
    it("calls onClick when pressed", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        renderWithProviders(<Button onClick={onClick}>Vote</Button>);

        await user.click(screen.getByRole("button", { name: "Vote" }));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("shows loading state and disables interaction", () => {
        const onClick = vi.fn();

        renderWithProviders(
            <Button isLoading onClick={onClick}>
                Vote
            </Button>,
        );

        const button = screen.getByRole("button", { name: /loading/i });
        expect(button).toBeDisabled();
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
});