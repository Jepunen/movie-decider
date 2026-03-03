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

  const commonClasses = "px-4 py-3 text-4xl font-black rounded-2xl text-center w-full max-w-[240px] tracking-[0.2em] outline-none transition-all duration-200";

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {isHost ? (
        <button
          onClick={handleCopyToClipboard}
          className={`${commonClasses} bg-white/10 text-primary border-2 border-primary/20 hover:bg-primary/10 hover:border-primary active:scale-95 cursor-pointer`}
        >
          {copied ? "COPIED" : code}
        </button>
      ) : (
        <input
          id="room-code-input"
          name="roomCode"
          type="text"
          inputMode="numeric"
          value={code}
          onChange={handleInputChange}
          placeholder="000000"
          maxLength={6}
          className={`${commonClasses} bg-white/5 text-foreground border-2 border-white/10 focus:border-primary focus:bg-white/10 placeholder:text-white/20`}
        />
      )}
    </div>
  );
};

export default RoomCode;
