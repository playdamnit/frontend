"use client";

import { GameCard } from "./GameCard";
import { Game, UserGameWithUserData } from "@playdamnit/api-client";

interface GamesListProps {
  games: UserGameWithUserData[];
  isOwnProfile: boolean;
  viewMode: "grid" | "row";
  onGameClick: (game: UserGameWithUserData) => void;
  onDeleteClick?: (game: UserGameWithUserData) => void;
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
  const groupedGames = games.reduce<Record<string, UserGameWithUserData[]>>(
    (acc, game) => {
      // Get year based on game status and available dates
      let year = "Unknown Year";

      // For finished or dropped games, prioritize endedAt (when user finished/dropped the game)
      if (
        (game.userGameData?.status === "finished" ||
          game.userGameData?.status === "dropped") &&
        game.userGameData?.endedAt
      ) {
        year = new Date(game.userGameData.endedAt).getFullYear().toString();
      }
      // Fall back to when the game was added to the user's library
      else if (game.userGameData?.addedAt) {
        year = new Date(game.userGameData.addedAt).getFullYear().toString();
      }
      // Final fallback to the game's original release date
      else if (game.firstReleaseDate) {
        // Convert Unix timestamp to year
        year = new Date(game.firstReleaseDate * 1000).getFullYear().toString();
      }

      if (!acc[year]) {
        acc[year] = [];
      }

      acc[year].push(game);
      return acc;
    },
    {}
  );

  // Sort years in descending order (newest first)
  const sortedYears = Object.keys(groupedGames).sort((a, b) => {
    if (a === "Unknown Year") return 1;
    if (b === "Unknown Year") return -1;
    return parseInt(b) - parseInt(a);
  });

  // Sort games within each year chronologically (newest first)
  sortedYears.forEach((year) => {
    groupedGames[year].sort((a, b) => {
      // Helper function to get the primary date for sorting
      const getDateForSorting = (game: UserGameWithUserData): Date => {
        // For finished or dropped games, prioritize endedAt
        if (
          (game.userGameData?.status === "finished" ||
            game.userGameData?.status === "dropped") &&
          game.userGameData?.endedAt
        ) {
          return new Date(game.userGameData.endedAt);
        }
        // Fall back to when the game was added to the user's library
        else if (game.userGameData?.addedAt) {
          return new Date(game.userGameData.addedAt);
        }
        // Final fallback to the game's original release date
        else if (game.firstReleaseDate) {
          return new Date(game.firstReleaseDate * 1000);
        }
        // If no date available, use a very old date to sort to the end
        return new Date(0);
      };

      const dateA = getDateForSorting(a);
      const dateB = getDateForSorting(b);

      // Sort by date descending (newest first), then by name if dates are equal
      const dateDiff = dateB.getTime() - dateA.getTime();
      return dateDiff !== 0 ? dateDiff : a.name.localeCompare(b.name);
    });
  });

  if (viewMode === "grid") {
    return (
      <div className="space-y-8">
        {sortedYears.map((year) => (
          <div key={year}>
            <h2 className="text-xl font-bold text-playdamnit-light mb-4 border-b border-playdamnit-purple/20 pb-2">
              {year}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
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
