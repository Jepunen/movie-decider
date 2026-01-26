"use client";

import React, { useState } from "react";

interface RoomCodeProps {
  isHost: boolean;
  code: string;
  onCodeChange?: (code: string) => void;
}

const RoomCode: React.FC<RoomCodeProps> = ({ isHost, code, onCodeChange }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    onCodeChange?.(value);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {isHost ? (
        <button
          onClick={handleCopyToClipboard}
          className="px-2 py-1 bg-accent text-primary text-4xl font-black border-solid border-2 border-secondary rounded-md  text-center w-40 tracking-widest transition-all duration-200 active:scale-95"
        >
          {copied ? "Copied" : code}
        </button>
      ) : (
        <input
          id="room-code-input"
          name="roomCode"
          type="text"
          value={code}
          onChange={handleInputChange}
          placeholder="______"
          maxLength={6}
          className="px-2 py-1 bg-accent text-primary text-4xl font-black border-solid border-2 border-secondary rounded-md text-center w-40 tracking-widest"
        />
      )}
    </div>
  );
};

export default RoomCode;
