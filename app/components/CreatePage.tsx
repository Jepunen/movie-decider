import React, { useState } from "react";
import Header from "./Header";
import StatusImage from "./StatusImage";
import Button from "./Button";
import RoomCode from "./RoomCode";
import PillButtonGroup from "./PillButtonGroup";
import type { Screen } from "@/types/screen";
import BackButton from "./BackButton";

interface CreatePageProps {
  onNavigate: (screen: Screen, code?: string) => void;
}

export default function CreatePage({ onNavigate }: CreatePageProps) {
  const [selected, setSelected] = useState("create");

  return (
    // min-h-[calc(100vh-2rem)] accounts for the p-4 padding in page.tsx
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-2rem)] w-full">
      <BackButton onClick={() => onNavigate("home")} />

      <div className="mt-8">
        <Header />
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <StatusImage status="default" />
      </div>

      <div className="flex flex-col items-center gap-2 w-full">
        <h2 className="text-4xl text-text font-black text-center">Room Code</h2>
        {/* TODO: Implement function to create the room code */}
        <RoomCode isHost code="123456" />
      </div>

      <div className="flex flex-col gap-9 w-full mt-24">
        <Button onClick={() => onNavigate("review")}>Start Game</Button>
      </div>

      <div className="flex flex-col gap-9 w-full mt-8">
        <PillButtonGroup
          options={[
            { label: "Create", value: "create" },
            { label: "Preferences", value: "preferences" },
          ]}
          value={selected}
          onChange={setSelected}
        />
      </div>
    </div>
  );
}
