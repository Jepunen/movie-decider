import React, { useState } from "react";
import GenreButton from "../_GenreSelector/GenreButton";
import { genres } from "@/app/constants/genres";

type GenreSelectorProps = {
  onChange?: (selected: number[]) => void;
  selected?: number[];
};

// Usage:
// - To access selected genres outside this component (e.g., for API calls), pass an `onChange` callback from the parent component.
// - Example:
//     const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
//     <GenreSelector onChange={setSelectedGenres} />
// - The parent can now use `selectedGenres` as needed.

export default function GenreSelector({
  onChange,
  selected = [],
}: GenreSelectorProps) {
  const toggleGenre = (id: number) => {
    const updated = selected.includes(id)
      ? selected.filter((g) => g !== id)
      : [...selected, id];
    if (onChange) {
      onChange(updated);
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, columnGap: 8 }}>
      {genres.map((genre) => (
        <GenreButton
          key={genre.id}
          selected={selected.includes(genre.id)}
          onClick={() => toggleGenre(genre.id)}
        >
          {genre.name}
        </GenreButton>
      ))}
    </div>
  );
}
