"use client";

import { useState } from "react";
import { Star, PlusCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { GameSearchResult } from "@/utils/types/game";
import AddGameModal from "@/components/add-game-modal";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GameResultProps {
  game: GameSearchResult & {
    userRating?: number;
    userStatus?: string;
    userReview?: string;
  };
  className?: string;
}

export default function GameResult({ game, className }: GameResultProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (!game) return null;

  // Safely format the date with validation
  const formattedDate = (() => {
    if (!game.firstReleaseDate) return "Release date unknown";

    try {
      // Ensure it's a valid timestamp (in seconds)
      const timestamp =
        typeof game.firstReleaseDate === "number"
          ? game.firstReleaseDate
          : parseInt(game.firstReleaseDate as any);

      if (isNaN(timestamp) || timestamp <= 0) return "Release date unknown";

      // Convert seconds to milliseconds for JavaScript Date
      return format(new Date(timestamp * 1000), "MMM d, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Release date unknown";
    }
  })();

  const imageUrl = game.cover?.url
    ? game.cover.url.startsWith("https:")
      ? game.cover.url.replace("t_thumb", "t_cover_big")
      : `https:${game.cover.url.replace("t_thumb", "t_cover_big")}`
    : "/placeholder.svg";

  // Format user status for display
  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      finished: "Finished",
      playing: "Playing",
      dropped: "Dropped",
      want_to_play: "Want to Play",
    };
    return statusMap[status] || status;
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleSuccess = () => {
    setIsAddModalOpen(false);
  };

  return (
    <>
      <motion.div
        className={cn("mb-4", className)}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-playdamnit-dark/50 border border-playdamnit-purple/20 rounded-lg overflow-hidden">
          <div className="flex">
            {/* Game cover */}
            <div className="relative w-[100px] h-[140px] flex-shrink-0">
              <img
                src={imageUrl}
                alt={game.name}
                className="h-full w-full object-cover"
              />
              {game.totalRating && !game.userRating && (
                <div className="absolute bottom-2 left-2 bg-playdamnit-darker/80 rounded-full px-2 py-1 flex items-center z-20">
                  <Star className="h-3 w-3 text-playdamnit-cyan mr-1" />
                  <span className="text-xs font-medium">
                    {(game.totalRating / 10).toFixed(1)}
                  </span>
                </div>
              )}
              {game.userRating && (
                <div className="absolute bottom-2 left-2 bg-playdamnit-purple/80 rounded-full px-2 py-1 flex items-center z-20">
                  <Star className="h-3 w-3 text-playdamnit-cyan mr-1" />
                  <span className="text-xs font-medium">
                    {game.userRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Game details */}
            <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 pr-8">
                    {game.name}
                  </h3>
                  <button
                    onClick={handleOpenAddModal}
                    className="w-8 h-8 rounded-full bg-playdamnit-purple/30 flex items-center justify-center hover:bg-playdamnit-purple hover:scale-110 transition-all duration-300"
                    aria-label="Add game to collection"
                  >
                    <PlusCircle className="h-5 w-5 text-playdamnit-cyan" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-sm text-playdamnit-light/70">
                    {formattedDate}
                  </span>

                  {game.userStatus && (
                    <span className="bg-playdamnit-purple/30 rounded-full px-2 py-0.5 text-xs text-playdamnit-light flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-playdamnit-cyan" />
                      {formatStatus(game.userStatus)}
                    </span>
                  )}
                </div>

                {/* Game genres */}
                {game.genres && game.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {game.genres.slice(0, 3).map((genre) => (
                      <span
                        key={genre.id}
                        className="bg-playdamnit-purple/20 rounded-full px-2 py-0.5 text-xs text-playdamnit-light/70"
                      >
                        {genre.name}
                      </span>
                    ))}
                    {game.genres.length > 3 && (
                      <span className="bg-playdamnit-purple/20 rounded-full px-2 py-0.5 text-xs text-playdamnit-light/70">
                        +{game.genres.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* User review */}
                {game.userReview && (
                  <div className="mb-2 mt-1">
                    <p className="text-xs italic text-playdamnit-light/90 bg-playdamnit-purple/10 p-2 rounded-md border-l-2 border-playdamnit-purple/30">
                      &quot;{game.userReview}&quot;
                    </p>
                  </div>
                )}

                {/* Game summary */}
                {game.summary && !game.userReview && (
                  <p className="text-xs text-playdamnit-light/80 line-clamp-3">
                    {game.summary}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add Game Modal */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSuccess={handleSuccess}
        game={game}
        isEmbedded={true}
      />
    </>
  );
}
