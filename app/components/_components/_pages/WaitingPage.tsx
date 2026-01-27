import React, { useState } from "react";
import Header from "../_ui/Header";
import StatusImage from "../StatusImage";
import PillButtonGroup from "../PillButtonGroup";
import BackButton from "../BackButton";
import GenreSelector from "../GenreSelector";
import type { Screen } from "@/types/screen";

interface JoinPageProps {
	onNavigate: (screen: Screen, code?: string) => void;
}

export default function WaitingPage({ onNavigate }: JoinPageProps) {
	const [selected, setSelected] = useState("waiting");
	const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

	return (
		<div className="relative flex flex-col min-h-[calc(100dvh-2rem)] w-full max-w-screen-sm items-center gap-6 pb-6">
			<BackButton onClick={() => onNavigate("join")} />

			<div className="pt-10">
				<Header />
			</div>

			<div className="text-center mt-6 text-2xl font-medium text-text px-4">
				{selected === "waiting" && (
					<p>Wait for host to start the game!</p>
				)}
				{selected === "preferences" && (
					<p>Set your genre preferences!</p>
				)}
			</div>

			<div className="flex-1 flex items-center justify-center w-full px-2">
				{selected === "waiting" && <StatusImage status="waiting" />}
			</div>

			{selected === "preferences" && (
				<div className="flex flex-col items-center gap-2 w-full px-2">
					<h3 className="text-2xl font-semibold text-text">
						Select Genres
					</h3>
					<GenreSelector
						onChange={setSelectedGenres}
						selected={selectedGenres}
					/>
				</div>
			)}

			<div className="flex flex-col w-full px-1">
				<PillButtonGroup
					options={[
						{ label: "Waiting Room", value: "waiting" },
						{ label: "Preferences", value: "preferences" },
					]}
					value={selected}
					onChange={setSelected}
					className="w-full justify-center"
				/>
			</div>
		</div>
	);
}
