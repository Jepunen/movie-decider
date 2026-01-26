import React, { useState } from "react";
import Header from "./Header";
import StatusImage from "./StatusImage";
import Button from "./Button";
import RoomCode from "./RoomCode";
import type { Screen } from "@/types/screen";
import BackButton from "./BackButton";

interface JoinPageProps {
  onNavigate: (screen: Screen, code?: string) => void;
}

export default function JoinPage({ onNavigate }: JoinPageProps) {
  const [guestCode, setGuestCode] = useState("");

  return (
    // min-h-[calc(100vh-2rem)] accounts for the p-4 padding in page.tsx
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-2rem)] w-full">
      <BackButton onClick={() => onNavigate("home")} />

      <div className="mt-8">
        <Header />
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <StatusImage status="joining" />
      </div>

      <div className="flex flex-col items-center gap-2 w-full">
        <h2 className="text-4xl text-text font-black text-center">Room Code</h2>
        {/* TODO: Implement function to create the room code */}
        <RoomCode
          isHost={false}
          code={guestCode}
          onCodeChange={(code) => setGuestCode(code)}
        />
      </div>

      <div className="flex flex-col gap-9 w-full mt-12">
        <Button
          onClick={() => {
            onNavigate("waiting");
          }}
        >
          Join Game
        </Button>
      </div>
    </div>
  );
}
