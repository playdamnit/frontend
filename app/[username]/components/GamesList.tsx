"use client";

import { GameCard } from "./GameCard";
import { Game } from "@playdamnit/api-client";

interface GamesListProps {
  games: Game[];
  isOwnProfile: boolean;
  viewMode: "grid" | "row";
  onGameClick: (game: Game) => void;
  onDeleteClick?: (game: Game) => void;
}

export function GamesList({
  games,
  isOwnProfile,
  viewMode,
  onGameClick,
  onDeleteClick,
}: GamesListProps) {
  if (!games || games.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-playdamnit-light/40 mb-2">No games found</div>
        <div className="text-sm text-playdamnit-light/30">
          {isOwnProfile
            ? "Add some games to your collection"
            : "This user hasn't added any games yet"}
        </div>
      </div>
    );
  }

  // Group games by year
  const groupedGames = games.reduce<Record<string, Game[]>>((acc, game) => {
    // Get year from firstReleaseDate (Unix timestamp in milliseconds) or addedAt (ISO string)
    let year = "Unknown Year";

    if (game.firstReleaseDate) {
      // Convert Unix timestamp to year
      year = new Date(game.firstReleaseDate * 1000).getFullYear().toString();
    } else if (game.userGameData?.addedAt) {
      // Extract year from ISO date string
      year = new Date(game.userGameData.addedAt).getFullYear().toString();
    }

    if (!acc[year]) {
      acc[year] = [];
    }

    acc[year].push(game);
    return acc;
  }, {});

  // Sort years in descending order (newest first)
  const sortedYears = Object.keys(groupedGames).sort((a, b) => {
    if (a === "Unknown Year") return 1;
    if (b === "Unknown Year") return -1;
    return parseInt(b) - parseInt(a);
  });

  // Sort games within each year by name
  sortedYears.forEach((year) => {
    groupedGames[year].sort((a, b) => a.name.localeCompare(b.name));
  });

  if (viewMode === "grid") {
    return (
      <div className="space-y-8">
        {sortedYears.map((year) => (
          <div key={year}>
            <h2 className="text-xl font-bold text-playdamnit-light mb-4 border-b border-playdamnit-purple/20 pb-2">
              {year}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedGames[year].map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  isOwnProfile={isOwnProfile}
                  viewMode={viewMode}
                  onGameClick={onGameClick}
                  onDeleteClick={onDeleteClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedYears.map((year) => (
        <div key={year}>
          <h2 className="text-xl font-bold text-playdamnit-light mb-4 border-b border-playdamnit-purple/20 pb-2">
            {year}
          </h2>
          <div className="space-y-4">
            {groupedGames[year].map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isOwnProfile={isOwnProfile}
                viewMode={viewMode}
                onGameClick={onGameClick}
                onDeleteClick={onDeleteClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
