"use client";

import Header from "../_ui/Header";
import StatusImage from "../StatusImage";
import Button from "../Button";
import type { Screen } from "@/types/screen";
import { useMutation } from "@tanstack/react-query";

interface HomePageProps {
	onNavigate: (screen: Screen, code?: string) => void;
}

const createRoom = async () => {
	const res = await fetch("/api/session/create", {
		method: "POST",
	});

	if (!res.ok) {
		throw new Error("Failed to create room");
	}

	return res.json();
};

export default function HomePage({ onNavigate }: HomePageProps) {
	const createRoomMutation = useMutation({
		mutationFn: createRoom,
		onSuccess: (data) => {
			onNavigate("create", data.sessionID.toString());
		},
	});

	const handleCreateRoom = () => {
		createRoomMutation.mutate();
	};

	return (
		// min-h-[calc(100vh-2rem)] accounts for the p-4 padding in page.tsx
		<div className="flex flex-col items-center justify-between min-h-[calc(100vh-2rem)] w-full">
			<div className="mt-8">
				<Header />
			</div>

			<div className="flex-1 flex items-center justify-center w-full">
				<StatusImage status="default" />
			</div>

			<div className="flex flex-col gap-9 w-full mb-8">
				<Button
					onClick={handleCreateRoom}
					disabled={createRoomMutation.isPending}
				>
					Create Room
				</Button>
				<Button onClick={() => onNavigate("join")}>Join Room</Button>
			</div>
		</div>
	);
}
