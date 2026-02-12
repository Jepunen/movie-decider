import React from "react";

interface BackButtonProps {
  onClick: () => void;
  ariaLabel?: string;
}

export default function BackButton({
  onClick,
  ariaLabel = "Go back",
}: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute left-4 top-4 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 z-50"
      aria-label={ariaLabel}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
  );
}
