import ResultCard from "../ResultCard";
import type { Result } from "@/types/movies";
import Header from "../_ui/Header";

interface ResultsPageProps {
  results: Result[];
}

export default function ResultsPage({ results }: ResultsPageProps) {
  return (
    <div className="flex flex-col items-center w-full h-[calc(100vh-2rem)]">
      <div className="shrink-0">
        <Header />
      </div>
      <h2 className="text-2xl font-bold my-4 shrink-0">
        Results {results.length > 0 && `(${results.length} movies)`}
      </h2>
      <div className="w-full flex-1 overflow-y-auto pb-4 flex justify-center">
        {results.length === 0 ? (
          <div className="text-center text-text/50 mt-8">
            Waiting for votes...
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-w-2xl mx-auto px-2">
            {results.map((result, idx) => (
              <div
                key={result.movie.imdb_id || idx}
                className="shrink-0"
              >
                <ResultCard
                  movie={result.movie}
                  compatibilityScore={result.compatibility}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
