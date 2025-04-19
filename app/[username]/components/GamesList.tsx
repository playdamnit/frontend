"use client";

import { GameCard, Game } from "./GameCard";

interface GamesListProps {
  games: Game[];
  isOwnProfile: boolean;
  viewMode: "grid" | "row";
  onGameClick: (game: Game) => void;
}

export function GamesList({
  games,
  isOwnProfile,
  viewMode,
  onGameClick,
}: GamesListProps) {
  if (!games || games.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-quokka-light/40 mb-2">No games found</div>
        <div className="text-sm text-quokka-light/30">
          {isOwnProfile
            ? "Add some games to your collection"
            : "This user hasn't added any games yet"}
        </div>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            isOwnProfile={isOwnProfile}
            viewMode={viewMode}
            onGameClick={onGameClick}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          isOwnProfile={isOwnProfile}
          viewMode={viewMode}
          onGameClick={onGameClick}
        />
      ))}
    </div>
  );
}
