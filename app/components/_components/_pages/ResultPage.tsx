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
		<div className="flex flex-col items-center w-full h-[calc(100vh-2rem)]">
			<div className="shrink-0">
				<Header />
			</div>
			<h2 className="text-2xl font-bold my-4 shrink-0">Results</h2>
			<div className="w-full flex-1 overflow-y-auto pb-4 flex justify-center">
				<div className="flex flex-col gap-2 max-w-2xl mx-auto px-2">
					{results.map((result, idx) => (
						<div
							key={result.movie.imdb_id || idx}
							className="shrink-0"
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
