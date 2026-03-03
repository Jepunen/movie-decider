import React from "react";

export interface RateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  rate: "worst" | "bad" | "normal" | "good" | "best";
}

const colors: Record<RateButtonProps["rate"], string> = {
  worst: "bg-red-500",
  bad: "bg-orange-500",
  normal: "bg-yellow-500",
  good: "bg-lime-500",
  best: "bg-green-500",
};

const emojis: Record<RateButtonProps["rate"], string> = {
  worst: "🤮",
  bad: "😖",
  normal: "😐",
  good: "🙂",
  best: "🤩",
};

export default function RateButton({ rate, ...rest }: RateButtonProps) {
  const colorClass = colors[rate] ?? colors.normal;

  return (
    <button
      {...rest}
      className={`transition-transform duration-150 ease-out active:scale-90 hover:scale-110 ${rest.className ?? ""}`}
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center ${colorClass} shadow-lg shadow-black/20 border-2 border-white/10`}
      >
        <span className="text-4xl leading-none filter drop-shadow-sm">{emojis[rate]}</span>
      </div>
    </button>
  );
}
