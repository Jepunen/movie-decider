"use client";

import Header from "../_ui/Header";
import StatusImage from "../StatusImage";
import Button from "../Button";
import type { Screen } from "@/types/screen";

interface HomePageProps {
	onNavigate: (screen: Screen, code?: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
	return (
		<div className="relative flex flex-col min-h-[calc(100dvh-2rem)] w-full max-w-screen-sm items-center gap-6 pb-6">
			<div className="pt-6">
				<Header />
			</div>

			<div className="flex-1 flex items-center justify-center w-full px-2">
				<StatusImage status="default" />
			</div>

			<div className="flex flex-col gap-4 w-full mb-2 px-1">
				<Button onClick={() => onNavigate("create")}>
					Create Room
				</Button>
				<Button onClick={() => onNavigate("join")}>Join Room</Button>
			</div>
		</div>
	);
}
