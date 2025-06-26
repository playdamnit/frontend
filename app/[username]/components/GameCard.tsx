"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Trophy,
  Gamepad2,
  Pencil,
  Trash2,
  Calendar,
  Star,
  Users,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Game, UserGameWithUserData } from "@playdamnit/api-client";

interface GameCardProps {
  game: UserGameWithUserData;
  isOwnProfile: boolean;
  viewMode: "grid" | "row";
  onGameClick: (game: UserGameWithUserData) => void;
  onDeleteClick?: (game: UserGameWithUserData) => void;
}

export function GameCard({
  game,
  isOwnProfile,
  viewMode,
  onGameClick,
  onDeleteClick,
}: GameCardProps) {
  // Map database status to display status
  const getDisplayStatus = (status?: string) => {
    switch (status) {
      case "finished":
        return "Finished";
      case "playing":
        return "Playing";
      case "dropped":
        return "Dropped";
      case "want_to_play":
        return "Want to Play";
      default:
        return "Unknown";
    }
  };

  // Get status color and icon
  const getStatusInfo = (status?: string) => {
    switch (status) {
      case "finished":
        return {
          color:
            "bg-playdamnit-cyan/15 text-playdamnit-cyan border-playdamnit-cyan/30",
          icon: "✓",
          label: "Finished",
        };
      case "playing":
        return {
          color: "bg-green-500/15 text-green-300 border-green-500/30",
          icon: "▶",
          label: "Playing",
        };
      case "dropped":
        return {
          color: "bg-red-500/15 text-red-300 border-red-500/30",
          icon: "✕",
          label: "Dropped",
        };
      case "want_to_play":
        return {
          color: "bg-blue-500/15 text-blue-300 border-blue-500/30",
          icon: "⭐",
          label: "Want to Play",
        };
      default:
        return {
          color:
            "bg-playdamnit-purple/15 text-playdamnit-purple border-playdamnit-purple/30",
          icon: "?",
          label: "Unknown",
        };
    }
  };

  // Get rating color based on score
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-400";
    if (rating >= 6) return "text-playdamnit-cyan";
    if (rating >= 4) return "text-yellow-400";
    if (rating > 0) return "text-red-400";
    return "text-playdamnit-light/40";
  };

  // Format rating display
  const formatRating = (rating: number) => {
    const validRating = Math.max(0, Math.min(10, rating || 0));
    return validRating.toFixed(1);
  };

  // Format ended date
  const formatEndedDate = (endedAt: string) => {
    const date = new Date(endedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays}d ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months}mo ago`;
    } else {
      return date.getFullYear().toString();
    }
  };

  // Format release date
  const formatReleaseDate = (timestamp?: number | null) => {
    if (!timestamp) return null;
    const date = new Date(timestamp * 1000);
    return date.getFullYear().toString();
  };

  // Check if game should show ended date
  const shouldShowEndedDate = (status?: string, endedAt?: string | null) => {
    return (status === "finished" || status === "dropped") && endedAt;
  };

  // Format cover image URL
  const getCoverUrl = (coverUrl?: string | null): string | undefined => {
    if (!coverUrl) return undefined;

    if (coverUrl.startsWith("//")) {
      return `https:${coverUrl.replace("t_thumb", "t_cover_big")}`;
    }
    return coverUrl.replace("t_thumb", "t_cover_big");
  };

  // Get platform display
  const getPlatformDisplay = (platforms?: any[]) => {
    if (!platforms || platforms.length === 0) return "Unknown";
    const primary = platforms[0]?.name || "Unknown";
    const additional = platforms.length > 1 ? ` +${platforms.length - 1}` : "";
    return primary + additional;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteClick) {
      onDeleteClick(game);
    }
  };

  const statusInfo = getStatusInfo(game.userGameData?.status);
  const coverUrl = getCoverUrl(game.cover?.url);
  const rating = game.userGameData?.rating || 0;
  const releaseYear = formatReleaseDate(game.firstReleaseDate);
  const platformDisplay = getPlatformDisplay(game.platforms);

  if (viewMode === "grid") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-playdamnit-dark/30 border border-playdamnit-purple/20 rounded-xl overflow-hidden hover:border-playdamnit-cyan/50 transition-all duration-200 hover:shadow-lg hover:shadow-playdamnit-purple/10 group ${
          isOwnProfile ? "cursor-pointer relative" : ""
        }`}
        onClick={() => isOwnProfile && onGameClick(game)}
      >
        {isOwnProfile && (
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
            <div className="bg-playdamnit-purple/90 text-white p-2 rounded-full hover:bg-playdamnit-purple transition-colors">
              <Pencil size={12} />
            </div>
            {onDeleteClick && (
              <div
                className="bg-red-500/90 text-white p-2 rounded-full cursor-pointer hover:bg-red-500 transition-colors"
                onClick={handleDelete}
              >
                <Trash2 size={12} />
              </div>
            )}
          </div>
        )}

        <div className="p-4">
          <div className="flex gap-4">
            {/* Game Cover */}
            <div className="w-20 h-28 rounded-lg overflow-hidden bg-playdamnit-dark/50 flex-shrink-0 shadow-md">
              {coverUrl ? (
                <img
                  src={coverUrl}
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
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="font-bold text-playdamnit-light truncate group-hover:text-playdamnit-cyan transition-colors">
                  {game.name}
                </h3>
                <Badge
                  variant="outline"
                  className={`${statusInfo.color} text-xs font-medium flex-shrink-0`}
                >
                  {statusInfo.icon} {statusInfo.label}
                </Badge>
              </div>

              <div className="text-sm text-playdamnit-light/60 mb-3 flex items-center gap-2">
                <span>{platformDisplay}</span>
                {releaseYear && (
                  <>
                    <span className="text-playdamnit-light/20">•</span>
                    <span>{releaseYear}</span>
                  </>
                )}
              </div>

              {/* Rating & Date Row */}
              <div className="flex items-center justify-between mb-3">
                {rating > 0 ? (
                  <div className="flex items-center gap-1">
                    <Star className={`w-3 h-3 ${getRatingColor(rating)}`} />
                    <span
                      className={`text-sm font-medium ${getRatingColor(rating)}`}
                    >
                      {formatRating(rating)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-playdamnit-light/40">
                    Not rated
                  </span>
                )}

                {shouldShowEndedDate(
                  game.userGameData?.status,
                  game.userGameData?.endedAt
                ) && (
                  <div className="text-xs text-playdamnit-light/60">
                    {formatEndedDate(game.userGameData.endedAt!)}
                  </div>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-1">
                {game.genres?.slice(0, 2).map((genre) => (
                  <span
                    key={genre.id}
                    className="px-2 py-0.5 bg-playdamnit-purple/10 border border-playdamnit-purple/20 rounded-full text-xs text-playdamnit-light/70"
                  >
                    {genre.name}
                  </span>
                ))}
                {game.genres && game.genres.length > 2 && (
                  <span className="px-2 py-0.5 bg-playdamnit-purple/10 border border-playdamnit-purple/20 rounded-full text-xs text-playdamnit-light/70">
                    +{game.genres.length - 2}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Row view - Compact analytics-style layout
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-playdamnit-dark/30 border border-playdamnit-purple/20 rounded-xl overflow-hidden hover:border-playdamnit-cyan/50 transition-all duration-200 hover:shadow-lg hover:shadow-playdamnit-purple/10 group ${
        isOwnProfile ? "cursor-pointer relative" : ""
      }`}
      onClick={() => isOwnProfile && onGameClick(game)}
    >
      {isOwnProfile && (
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
          <div className="bg-playdamnit-purple/90 text-white p-2 rounded-full hover:bg-playdamnit-purple transition-colors">
            <Pencil size={12} />
          </div>
          {onDeleteClick && (
            <div
              className="bg-red-500/90 text-white p-2 rounded-full cursor-pointer hover:bg-red-500 transition-colors"
              onClick={handleDelete}
            >
              <Trash2 size={12} />
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Game Cover - Smaller */}
          <div className="w-16 h-20 rounded-lg overflow-hidden bg-playdamnit-dark/50 flex-shrink-0 shadow-md">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-playdamnit-light/30">
                <Gamepad2 className="w-6 h-6" />
              </div>
            )}
          </div>

          {/* Main Info - Flexible */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-playdamnit-light group-hover:text-playdamnit-cyan transition-colors truncate mb-1">
                  {game.name}
                </h3>
                <div className="flex items-center gap-3 text-sm text-playdamnit-light/60">
                  <span>{platformDisplay}</span>
                  {releaseYear && (
                    <>
                      <span className="text-playdamnit-light/20">•</span>
                      <span>{releaseYear}</span>
                    </>
                  )}
                  {game.totalRating && (
                    <>
                      <span className="text-playdamnit-light/20">•</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{(game.totalRating / 10).toFixed(1)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Status & Rating Analytics */}
              <div className="flex items-center gap-4 flex-shrink-0">
                {/* Status */}
                <div className="text-center">
                  <Badge
                    variant="outline"
                    className={`${statusInfo.color} text-xs font-medium px-2 py-1`}
                  >
                    {statusInfo.icon} {statusInfo.label}
                  </Badge>
                  {shouldShowEndedDate(
                    game.userGameData?.status,
                    game.userGameData?.endedAt
                  ) && (
                    <div className="text-xs text-playdamnit-light/50 mt-1">
                      {formatEndedDate(game.userGameData.endedAt!)}
                    </div>
                  )}
                </div>

                {/* Rating */}
                {rating > 0 && (
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Star className={`w-4 h-4 ${getRatingColor(rating)}`} />
                      <span
                        className={`text-lg font-bold ${getRatingColor(rating)}`}
                      >
                        {formatRating(rating)}
                      </span>
                    </div>
                    <div className="text-xs text-playdamnit-light/50">
                      Your Score
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Genres - Compact */}
            <div className="flex flex-wrap gap-1 mt-2">
              {game.genres?.slice(0, 3).map((genre) => (
                <span
                  key={genre.id}
                  className="px-2 py-0.5 bg-playdamnit-purple/10 border border-playdamnit-purple/20 rounded-full text-xs text-playdamnit-light/70"
                >
                  {genre.name}
                </span>
              ))}
              {game.genres && game.genres.length > 3 && (
                <span className="px-2 py-0.5 bg-playdamnit-purple/10 border border-playdamnit-purple/20 rounded-full text-xs text-playdamnit-light/70">
                  +{game.genres.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
