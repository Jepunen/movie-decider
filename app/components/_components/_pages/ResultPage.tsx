import React, { useEffect } from "react";
import ResultCard from "../ResultCard";
import { socket } from "../../../socket";
import type { Result } from "@/types/movies";
import Header from "../_ui/Header";

interface ResultsPageProps {
	results: Result[];
	onResultsUpdate?: (results: Result[]) => void;
}

export default function ResultsPage({
	results,
	onResultsUpdate,
}: ResultsPageProps) {
	useEffect(() => {
		// Listen for real-time results updates
		// TODO: Ensure socket wokrs correctly here
		socket.on("results_update", (data: Result[]) => {
			if (onResultsUpdate) {
				onResultsUpdate(data);
			}
		});

		return () => {
			socket.off("results_update");
		};
	}, [onResultsUpdate]);

	return (
		<div className="relative flex flex-col w-full max-w-screen-sm mx-auto h-[calc(100dvh-2rem)] overflow-hidden items-center">
			<div className="shrink-0 pt-6">
				<Header />
			</div>
			<h2 className="text-2xl font-bold my-4 shrink-0 px-4">Results</h2>
			<div className="w-full flex-1 overflow-y-auto pb-4 flex justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
				<div className="flex flex-col gap-2 max-w-2xl mx-auto px-2">
					{results
						.sort(
							(a, b) =>
								(b.compatibility ?? 0) - (a.compatibility ?? 0)
						)
						.map((result, idx) => (
							<div
								key={result.movie.imdb_id || idx}
								className="shrink-0 w-full"
							>
								<ResultCard
									movie={result.movie}
									compatibilityScore={result.compatibility}
								/>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
