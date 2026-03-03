import React from "react";

interface ResultCardCompatibilityProps {
  compatibilityScore?: number;
}

function getColor(score: number | undefined): string {
  if (score === undefined) return "text-gray-400";
  if (score < 40) return "text-red-500";
  if (score < 60) return "text-orange-400";
  if (score < 80) return "text-yellow-400";
  if (score < 90) return "text-lime-400";
  return "text-green-500";
}

export const ResultCardCompatibility: React.FC<
  ResultCardCompatibilityProps
> = ({ compatibilityScore }) => (
  <div className="flex flex-col items-center">
    <span className={`text-3xl font-bold ${getColor(compatibilityScore)}`}>
      {compatibilityScore !== undefined ? `${compatibilityScore}%` : "--"}
    </span>
    <span className="text-xs text-foreground/60">Compatibility</span>
  </div>
);
