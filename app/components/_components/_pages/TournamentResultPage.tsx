"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "../_ui/Header";
import Button from "../Button";
import type { TournamentRanking } from "@/types/tournament";
import { ResultCardModal } from "../../_ResultCard/ResultCardModal";
import { genreMap } from "@/app/constants/genres";

// ─── Helpers ────────────────────────────────────────────────────────

const PLACE_MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉", 4: "🥉" };

function placeLabel(place: number): string {
    if (place === 1) return "1st";
    if (place === 2) return "2nd";
    if (place === 3) return "3rd";
    return `${place}th`;
}

function genres(movie: TournamentRanking["movie"]): string {
    return movie.genres?.length
        ? movie.genres.slice(0, 3).map((g) => genreMap[g] || g).join(" • ")
        : "N/A";
}

// ─── Sub-components ─────────────────────────────────────────────────

/** Full-width winner hero card */
function WinnerCard({ ranking }: { ranking: TournamentRanking }) {
    const [open, setOpen] = useState(false);
    const { movie } = ranking;

    return (
        <>
            <div className="w-full rounded-2xl glass-card flex flex-col">
                {/* Poster — overflow-hidden lives here, not on glass-card, to avoid the
                    backdrop-filter + border-radius clipping bug */}
                <div className="relative w-full h-72 overflow-hidden rounded-t-2xl">
                    <Image
                        src={movie.poster_url}
                        alt={movie.title}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 100vw, 640px"
                        priority
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h2 className="text-2xl font-black text-white leading-tight drop-shadow">
                            {movie.title}
                        </h2>
                        <p className="text-sm text-white/80 mt-0.5">
                            {movie.release_date.slice(0, 4)} · {movie.runtime} · {genres(movie)}
                        </p>
                    </div>
                </div>

                {/* Action row */}
                <div className="w-full p-4 flex justify-end">
                    <Button onClick={() => setOpen(true)}>Info</Button>
                </div>
            </div>

            <ResultCardModal open={open} onClose={() => setOpen(false)} movie={movie} />
        </>
    );
}

/** Horizontal card for 2nd place */
function RunnerUpCard({ ranking }: { ranking: TournamentRanking }) {
    const [open, setOpen] = useState(false);
    const { movie, place } = ranking;

    return (
        <>
            <div className="flex w-full rounded-2xl glass-card overflow-hidden h-36">
                {/* Poster */}
                <div className="relative w-24 shrink-0">
                    <Image
                        src={movie.poster_url}
                        alt={movie.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                    />
                </div>

                {/* Details */}
                <div className="flex flex-col flex-1 px-3 py-2 gap-1 min-w-0 justify-center">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{PLACE_MEDAL[place] ?? `#${place}`}</span>
                        <span className="text-xs uppercase tracking-wide text-foreground/60 font-semibold">
                            {placeLabel(place)} place
                        </span>
                    </div>
                    <h3 className="font-bold text-base leading-tight text-foreground line-clamp-2">
                        {movie.title}
                    </h3>
                    <p className="text-xs text-foreground/60">
                        {movie.release_date.slice(0, 4)} · {movie.runtime}
                    </p>
                    <p className="text-xs text-foreground/60 line-clamp-1">{genres(movie)}</p>
                </div>

                {/* Info */}
                <div className="flex items-center pr-3">
                    <Button onClick={() => setOpen(true)}>Info</Button>
                </div>
            </div>

            <ResultCardModal open={open} onClose={() => setOpen(false)} movie={movie} />
        </>
    );
}

/** Compact card for 3rd–Nth place */
function CompactCard({ ranking }: { ranking: TournamentRanking }) {
    const [open, setOpen] = useState(false);
    const { movie, place } = ranking;
    const medal = PLACE_MEDAL[place];

    return (
        <>
            <div className="flex flex-col rounded-2xl glass-card overflow-hidden">
                {/* Poster */}
                <div className="relative aspect-[2/3] w-full overflow-hidden">
                    <Image
                        src={movie.poster_url}
                        alt={movie.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 45vw, 200px"
                    />
                    {/* Place badge */}
                    <div className="absolute top-2 left-2 bg-black/60 rounded-full px-2 py-0.5 flex items-center gap-1">
                        {medal
                            ? <span className="text-base">{medal}</span>
                            : <span className="text-xs font-bold text-white">{placeLabel(place)}</span>
                        }
                    </div>
                </div>

                {/* Info */}
                <div className="p-2 flex flex-col gap-1">
                    <p className="text-xs font-bold leading-tight text-foreground line-clamp-2">
                        {movie.title}
                    </p>
                    <p className="text-xs text-foreground/60">{movie.release_date.slice(0, 4)}</p>
                    <Button onClick={() => setOpen(true)}>Info</Button>
                </div>
            </div>

            <ResultCardModal open={open} onClose={() => setOpen(false)} movie={movie} />
        </>
    );
}

// ─── Page ────────────────────────────────────────────────────────────

interface TournamentResultPageProps {
    rankings: TournamentRanking[];
}

export default function TournamentResultPage({ rankings }: TournamentResultPageProps) {
    const sorted = [...rankings].sort((a, b) => a.place - b.place);

    const winner = sorted.find((r) => r.place === 1);
    const runnerUp = sorted.find((r) => r.place === 2);
    const podium = sorted.filter((r) => r.place === 3 || r.place === 4);
    const rest = sorted.filter((r) => r.place >= 5);

    return (
        <div className="relative flex flex-col w-full max-w-screen-sm mx-auto h-[calc(100dvh-2rem)] overflow-hidden items-center">
            <div className="shrink-0 pt-0.5">
                <Header />
            </div>

            <div className="w-full flex-1 overflow-y-auto pb-8 px-3 flex flex-col gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                {/* ── Trophy header ────────────────────────────────── */}
                <div className="text-center pt-2">
                    <p className="text-5xl">🏆</p>
                    <h1 className="text-2xl font-black text-gradient mt-1">Tournament Winner</h1>
                </div>

                {/* ── Winner ──────────────────────────────────────── */}
                {winner && <WinnerCard ranking={winner} />}

                {/* ── Runner-up ───────────────────────────────────── */}
                {runnerUp && (
                    <div className="flex flex-col gap-1">
                        <p className="text-xs uppercase tracking-wide text-foreground/50 font-semibold px-1">
                            Runner-Up
                        </p>
                        <RunnerUpCard ranking={runnerUp} />
                    </div>
                )}

                {/* ── Semi-final losers (3rd–4th) ─────────────────── */}
                {podium.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <p className="text-xs uppercase tracking-wide text-foreground/50 font-semibold px-1">
                            Semi-Final
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {podium.map((r, i) => (
                                <CompactCard key={r.movie.imdb_id || `podium-${i}`} ranking={r} />
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Quarter-final losers (5th–8th) ──────────────── */}
                {rest.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <p className="text-xs uppercase tracking-wide text-foreground/50 font-semibold px-1">
                            Quarter-Final
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {rest.map((r, i) => (
                                <CompactCard key={r.movie.imdb_id || `rest-${i}`} ranking={r} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
