import React from "react";
import Image from "next/image";

interface MoviePosterProps {
	posterPath?: string | null;
	title?: string | null;
	priority?: boolean;
}

export const MoviePoster: React.FC<MoviePosterProps> = ({
	posterPath,
	title,
	priority,
}) => {
	return (
		<div className="relative h-72 w-44 mb-2 shrink-0 self-center">
			<Image
				src={posterPath ?? "/movie_posters_DEV/the_martian.jpg"}
				alt={title ?? "Movie Poster"}
				fill
				priority={priority}
				className="object-cover rounded-lg shadow-md"
				sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
			/>
		</div>
	);
};
