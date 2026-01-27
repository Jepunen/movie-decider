import { useState } from "react";
import Header from "../_ui/Header";
import StatusImage from "../StatusImage";
import PillButtonGroup from "../PillButtonGroup";
import BackButton from "../BackButton";
import GenreSelector from "../GenreSelector";
import type { Screen } from "@/types/screen";

interface JoinPageProps {
	onNavigate: (screen: Screen, code?: string) => void;
	roomCode: string;
}

export default function WaitingPage({ onNavigate, roomCode }: JoinPageProps) {
	const [selected, setSelected] = useState("waiting");
	const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

	// Removed duplicate session-update listener - handled in page.tsx

	return (
		<div className="flex flex-col items-center justify-between min-h-[calc(100vh-2rem)] w-full">
			<BackButton onClick={() => onNavigate("join")} />

			<div className="mt-8">
				<Header />
			</div>

			<div className="text-center mt-24 text-2xl font-medium text-text">
				{selected === "waiting" && <p>Wait for host to start the game!</p>}
				{selected === "preferences" && <p>Set your genre preferences!</p>}
			</div>

			<div className="flex-1 flex items-center justify-center w-full">
				{selected === "waiting" && <StatusImage status="waiting" />}
			</div>

			{selected === "preferences" && (
				<div className="flex flex-col items-center gap-2 w-full mt-2 mb-2">
					<h3 className="text-2xl font-semibold text-text">Select Genres</h3>
					<GenreSelector onChange={setSelectedGenres} selected={selectedGenres} />
				</div>
			)}

			<div className="flex flex-col gap-9 w-full mt-8">
				<PillButtonGroup
					options={[
						{ label: "Waiting Room", value: "waiting" },
						{ label: "Preferences", value: "preferences" },
					]}
					value={selected}
					onChange={setSelected}
				/>
			</div>
		</div>
	);
}
