"use client";

import { motion } from "framer-motion";
import { Clock, Trophy, Gamepad2, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Game, UserGameWithUserData } from "@playdamnit/api-client";

interface GameCardProps {
  game: UserGameWithUserData;
  isOwnProfile: boolean;
  viewMode: "grid" | "row";
  onGameClick: (game: Game) => void;
  onDeleteClick?: (game: Game) => void;
}

export function GameCard({
  game,
  isOwnProfile,
  viewMode,
  onGameClick,
  onDeleteClick,
}: GameCardProps) {
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Finished":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Playing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Dropped":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Want":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-playdamnit-purple/20 text-playdamnit-purple border-playdamnit-purple/30";
    }
  };

  // Get rating color based on score
  const getRatingColor = (rating: number) => {
    if (rating >= 8)
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (rating >= 6) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (rating >= 4)
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (rating > 0) return "bg-red-500/20 text-red-400 border-red-500/30";
    return "bg-playdamnit-dark/50 text-playdamnit-light/40 border-playdamnit-light/10";
  };

  // Format rating display
  const formatRating = (rating: number) => {
    // Ensure rating is a valid number between 0 and 10
    const validRating = Math.max(0, Math.min(10, rating || 0));
    return validRating.toFixed(1);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click from triggering
    if (onDeleteClick) {
      onDeleteClick(game);
    }
  };

  if (viewMode === "grid") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-playdamnit-dark/30 border border-playdamnit-purple/10 rounded-xl overflow-hidden hover:border-playdamnit-purple/30 transition-all hover:shadow-lg hover:shadow-playdamnit-purple/5 group ${
          isOwnProfile ? "cursor-pointer relative" : ""
        }`}
        onClick={() => isOwnProfile && onGameClick(game)}
      >
        {isOwnProfile && (
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
            <div className="bg-playdamnit-purple/80 text-white p-1 rounded-full">
              <Pencil size={14} />
            </div>
            {onDeleteClick && (
              <div
                className="bg-red-500/80 text-white p-1 rounded-full cursor-pointer"
                onClick={handleDelete}
              >
                <Trash2 size={14} />
              </div>
            )}
          </div>
        )}
        <div className="p-4">
          <div className="flex gap-4">
            {/* Game Cover */}
            <div className="w-20 h-28 rounded-lg overflow-hidden bg-playdamnit-dark/50 flex-shrink-0">
              {game.cover ? (
                <img
                  src={
                    game.cover?.url?.startsWith("//")
                      ? `https:${game.cover.url.replace("t_thumb", "t_cover_big")}`
                      : game.cover?.url?.replace("t_thumb", "t_cover_big")
                  }
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-playdamnit-light/30">
                  <Gamepad2 className="w-8 h-8" />
                </div>
              )}
            </div>

            {/* Game Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold text-playdamnit-light truncate group-hover:text-playdamnit-cyan transition-colors">
                  {game.name}
                </h3>
                <Badge
                  className={`${getStatusColor(game.userGameData?.status)} text-xs`}
                >
                  {game.userGameData?.status}
                </Badge>
              </div>

              <div className="mt-1 text-sm text-playdamnit-light/60">
                {game.platforms?.[0]?.name}
              </div>

              <div className="mt-2">
                {game.userGameData?.rating && game.userGameData?.rating > 0 ? (
                  <Badge
                    className={`${getRatingColor(
                      game.userGameData?.rating
                    )} text-xs px-2 py-1 font-medium`}
                  >
                    {formatRating(game.userGameData?.rating)}
                  </Badge>
                ) : (
                  <span className="text-xs text-playdamnit-light/40">
                    Not rated
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {game.genres &&
                  game.genres.slice(0, 2).map((genre) => (
                    <span
                      key={genre.id}
                      className="px-2 py-0.5 bg-playdamnit-dark/50 rounded-full text-xs text-playdamnit-light/60"
                    >
                      {genre.name}
                    </span>
                  ))}
                {game.genres && game.genres.length > 2 && (
                  <span className="px-2 py-0.5 bg-playdamnit-dark/50 rounded-full text-xs text-playdamnit-light/60">
                    +{game.genres.length - 2}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Game Stats */}
          {/* <div className="mt-4 pt-3 border-t border-playdamnit-purple/5 grid grid-cols-3 gap-2 text-xs">
            {game.playtime !== undefined && (
              <div className="flex items-center gap-1.5 text-playdamnit-light/60">
                <Clock className="w-3 h-3 text-playdamnit-cyan" />
                <span>{game.playtime}h</span>
              </div>
            )}
            {game.achievements && (
              <div className="flex items-center gap-1.5 text-playdamnit-light/60">
                <Trophy className="w-3 h-3 text-playdamnit-cyan" />
                <span>
                  {game.achievements.completed}/{game.achievements.total}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-playdamnit-light/60 justify-self-end col-span-2 justify-end">
              <span>{game.dateAdded}</span>
            </div>
          </div> */}
        </div>
      </motion.div>
    );
  }

  // Row view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-playdamnit-dark/30 border border-playdamnit-purple/10 rounded-xl overflow-hidden hover:border-playdamnit-purple/30 transition-all hover:shadow-lg hover:shadow-playdamnit-purple/5 group ${
        isOwnProfile ? "cursor-pointer relative" : ""
      }`}
      onClick={() => isOwnProfile && onGameClick(game)}
    >
      {isOwnProfile && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
          <div className="bg-playdamnit-purple/80 text-white p-1 rounded-full">
            <Pencil size={14} />
          </div>
          {onDeleteClick && (
            <div
              className="bg-red-500/80 text-white p-1 rounded-full cursor-pointer"
              onClick={handleDelete}
            >
              <Trash2 size={14} />
            </div>
          )}
        </div>
      )}
      <div className="p-4">
        <div className="flex gap-6">
          {/* Game Cover */}
          <div className="w-24 h-32 rounded-lg overflow-hidden bg-playdamnit-dark/50 flex-shrink-0">
            {game.cover ? (
              <img
                src={
                  game.cover?.url?.startsWith("//")
                    ? `https:${game.cover.url.replace("t_thumb", "t_cover_big")}`
                    : game.cover?.url?.replace("t_thumb", "t_cover_big")
                }
                alt={game.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-playdamnit-light/30">
                <Gamepad2 className="w-10 h-10" />
              </div>
            )}
          </div>

          {/* Game Info */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="font-bold text-lg text-playdamnit-light group-hover:text-playdamnit-cyan transition-colors">
                  {game.name}
                </h3>
                <div className="mt-1 text-sm text-playdamnit-light/60 flex items-center gap-2">
                  <span>{game.platforms?.[0]?.name}</span>
                  {/* <span className="text-playdamnit-light/20">•</span> */}
                  {/* <span>{game.dateAdded}</span> */}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge
                  className={`${getStatusColor(game.userGameData?.status)} text-xs`}
                >
                  {game.userGameData?.status}
                </Badge>
                {game.userGameData?.rating && game.userGameData?.rating > 0 && (
                  <Badge
                    className={`${getRatingColor(
                      game.userGameData?.rating
                    )} text-xs px-2 py-1 font-medium`}
                  >
                    {formatRating(game.userGameData?.rating)}
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-auto pt-3 flex flex-wrap gap-2">
              {game.genres &&
                game.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-2 py-0.5 bg-playdamnit-dark/50 rounded-full text-xs text-playdamnit-light/60"
                  >
                    {genre.name}
                  </span>
                ))}
            </div>

            {/* Game Stats */}
            {/* <div className="mt-4 pt-3 border-t border-playdamnit-purple/5 flex gap-6 text-xs">
              {game.playtime !== undefined && (
                <div className="flex items-center gap-1.5 text-playdamnit-light/60">
                  <Clock className="w-3 h-3 text-playdamnit-cyan" />
                  <span>{game.playtime}h played</span>
                </div>
              )}
              {game.achievements && (
                <div className="flex items-center gap-1.5 text-playdamnit-light/60">
                  <Trophy className="w-3 h-3 text-playdamnit-cyan" />
                  <span>
                    {game.achievements.completed}/{game.achievements.total}{" "}
                    achievements
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-playdamnit-light/60 ml-auto">
                <span className="text-xs uppercase font-medium px-2 py-0.5 bg-playdamnit-dark/50 rounded-full">
                  {game.source}
                </span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
