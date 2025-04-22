"use client";

import { useState } from "react";
import { GameSearchResult } from "@/utils/types/game";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, PlusCircle } from "lucide-react";

interface GameResultsListProps {
  games: GameSearchResult[];
  onSelectGame: (game: GameSearchResult) => void;
  className?: string;
}

export default function GameResultsList({
  games,
  onSelectGame,
  className,
}: GameResultsListProps) {
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);

  if (!games || games.length === 0) return null;

  const handleSelectGame = (game: GameSearchResult) => {
    setSelectedGameId(game.id);
    onSelectGame(game);
  };

  return (
    <motion.div
      className={cn("mb-4", className)}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-playdamnit-dark/50 border border-playdamnit-purple/20 rounded-lg overflow-hidden p-3">
        <h3 className="text-sm font-medium text-playdamnit-light/70 mb-2">
          Multiple games found. Select the one you meant:
        </h3>
        <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
          {games.map((game) => {
            const imageUrl = game.cover?.url
              ? game.cover.url.startsWith("https:")
                ? game.cover.url.replace("t_thumb", "t_cover_small")
                : `https:${game.cover.url.replace("t_thumb", "t_cover_small")}`
              : "/placeholder.svg";

            return (
              <div
                key={game.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg border transition-all duration-200",
                  selectedGameId === game.id
                    ? "border-playdamnit-cyan bg-playdamnit-purple/10"
                    : "border-playdamnit-purple/10 hover:bg-playdamnit-purple/5"
                )}
              >
                {/* Game cover */}
                <div className="w-12 h-16 flex-shrink-0">
                  <img
                    src={imageUrl}
                    alt={game.name}
                    className="h-full w-full object-cover rounded"
                  />
                </div>

                {/* Game details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white">{game.name}</h4>
                  <p className="text-xs text-playdamnit-light/70">
                    {game.firstReleaseDate
                      ? new Date(game.firstReleaseDate * 1000).getFullYear()
                      : "Unknown year"}
                    {game.platforms && game.platforms.length > 0
                      ? ` • ${game.platforms[0].name}`
                      : ""}
                  </p>
                </div>

                {/* Select button */}
                <button
                  onClick={() => handleSelectGame(game)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                    selectedGameId === game.id
                      ? "bg-playdamnit-cyan text-playdamnit-dark"
                      : "bg-playdamnit-purple/30 text-playdamnit-cyan hover:bg-playdamnit-purple hover:scale-110"
                  )}
                  aria-label={`Select ${game.name}`}
                >
                  {selectedGameId === game.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <PlusCircle className="h-5 w-5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
