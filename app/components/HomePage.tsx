import React from "react";
import Header from "./Header";
import StatusImage from "./StatusImage";
import Button from "./Button";
import type { Screen } from "@/types/screen";

interface HomePageProps {
  onNavigate: (screen: Screen, code?: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
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
        <Button onClick={() => onNavigate("create")}>Create Room</Button>
        <Button onClick={() => onNavigate("join")}>Join Room</Button>
      </div>
    </div>
  );
}
