import Header from "./_ui/Header";
import StatusImage from "./StatusImage";
import type { TournamentRoundLabel } from "@/types/tournament";

interface TournamentRoundWaitingProps {
    /** Label of the round that just finished */
    roundLabel: TournamentRoundLabel;
    /** 0-based round index */
    roundIndex: number;
    /** Number of players in the room */
    playerCount: number;
}

export default function TournamentRoundWaiting({
    roundLabel,
    roundIndex,
    playerCount,
}: TournamentRoundWaitingProps) {
    const nextRoundName =
        roundIndex === 0
            ? "Semifinal"
            : roundIndex === 1
                ? "Final"
                : "Results";

    return (
        <div className="relative flex flex-col min-h-[calc(100dvh-2rem)] w-full max-w-screen-sm mx-auto items-center gap-6 pb-6 px-2">
            <div className="pt-0.5">
                <Header />
            </div>

            <div className="w-full rounded-2xl glass-card p-5 text-center">
                <p className="text-xs uppercase tracking-wide text-foreground/70">
                    {roundLabel} complete
                </p>
                <p className="text-2xl font-bold text-gradient mt-2">
                    Waiting for other players...
                </p>
                <p className="text-sm text-foreground/75 mt-2">
                    {playerCount} {playerCount === 1 ? "player" : "players"} in room
                </p>
            </div>

            <div className="flex-1 flex items-center justify-center w-full px-2">
                <StatusImage status="waiting" />
            </div>

            <div className="w-full rounded-2xl glass-card p-4 text-center">
                <p className="text-sm text-foreground/70">
                    Next up: <span className="font-semibold text-foreground">{nextRoundName}</span>
                </p>
            </div>
        </div>
    );
}
