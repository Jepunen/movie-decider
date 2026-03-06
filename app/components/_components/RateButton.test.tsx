import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import RateButton from "./RateButton";
import { renderWithProviders } from "@/test/renderWithProviders";

describe("RateButton", () => {
    it("renders the emoji matching the rate", () => {
        renderWithProviders(<RateButton rate="best" aria-label="Best rating" />);

        expect(screen.getByText("🤩")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Best rating" })).toBeInTheDocument();
    });

    it("invokes onClick when selected", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        renderWithProviders(
            <RateButton rate="normal" aria-label="Normal rating" onClick={onClick} />,
        );

        await user.click(screen.getByRole("button", { name: "Normal rating" }));

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});