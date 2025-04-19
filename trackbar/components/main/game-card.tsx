"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  Calendar,
  ExternalLink,
  Star,
  Gamepad,
} from "lucide-react";
import { format } from "date-fns";
import AddGameModal from "@/components/AddGameModal";
import { cn } from "@/lib/utils";

interface GameCover {
  alpha_channel: boolean;
  animated: boolean;
  checksum: string;
  game: number;
  height: number;
  id: number;
  image_id: string;
  url: string;
  width: number;
}

interface Genre {
  id: number;
  name: string;
  slug: string;
}

interface Platform {
  id: number;
  name: string;
  slug: string;
}

interface Game {
  cover: GameCover;
  first_release_date: number;
  id: number;
  name: string;
  genres: Genre[];
  summary: string;
  total_rating?: number;
  platforms?: Platform[];
  slug: string;
  created_at: number;
}

interface GameCardProps {
  game: Game;
  variant?: "default" | "compact" | "grid";
  className?: string;
  showAddButton?: boolean;
}

const GameCard = ({
  game,
  variant = "default",
  className = "",
  showAddButton = true,
}: GameCardProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (!game?.cover) return null;

  const formattedDate = game.first_release_date
    ? format(new Date(game.first_release_date * 1000), "MMM d, yyyy")
    : null;

  const imageUrl = game.cover.url.startsWith("https:")
    ? game.cover.url.replace("t_thumb", "t_720p")
    : `https:${game.cover.url.replace("t_thumb", "t_720p")}`;

  // Calculate aspect ratio for proper scaling
  const aspectRatio = game.cover.width / game.cover.height;
  const imageStyles = {
    objectFit: aspectRatio < 0.7 ? "contain" : "cover",
  } as const;

  // Handle modal open/close
  const handleOpenAddModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleSuccess = () => {
    setIsAddModalOpen(false);
    // You could add additional success handling here
  };

  // Render different variants
  if (variant === "compact") {
    return (
      <>
        <div
          className={cn(
            "group relative overflow-hidden rounded-xl bg-quokka-dark border border-quokka-purple/20 hover:border-quokka-purple/50 transition-all duration-300 select-none cursor-default hover:cursor-grab active:cursor-grabbing",
            className
          )}
        >
          <div className="flex">
            {/* Game cover with gradient overlay */}
            <div className="relative w-[80px] h-[120px] flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-quokka-dark/30 z-10" />
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={game.name}
                className="h-full w-full object-cover"
              />
              {game.total_rating && (
                <div className="absolute bottom-2 left-2 bg-quokka-darker/80 rounded-full px-2 py-1 flex items-center z-20">
                  <Star className="h-3 w-3 text-quokka-cyan mr-1" />
                  <span className="text-xs font-medium">
                    {(game.total_rating / 10).toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Game details */}
            <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
              <div>
                <h3
                  className="text-lg font-bold text-white mb-1 group-hover:text-quokka-cyan transition-colors line-clamp-1 pr-8"
                  title={game.name}
                >
                  {game.name}
                </h3>

                {formattedDate && (
                  <div className="flex items-center text-xs text-quokka-light/70">
                    <Calendar className="h-3 w-3 mr-1 text-quokka-cyan" />
                    <span>
                      {new Date(game.first_release_date * 1000).getFullYear()}
                    </span>
                  </div>
                )}
              </div>

              {/* Game genres */}
              {game.genres && game.genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 overflow-hidden">
                  {game.genres.slice(0, 2).map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-quokka-purple/20 rounded-full px-2 py-0.5 text-xs text-quokka-light/70 truncate max-w-[100px] inline-block"
                      title={genre.name}
                    >
                      {genre.name}
                    </span>
                  ))}
                  {game.genres.length > 2 && (
                    <span className="bg-quokka-purple/20 rounded-full px-2 py-0.5 text-xs text-quokka-light/70">
                      +{game.genres.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Add button */}
            {showAddButton && (
              <div
                className="absolute right-3 top-3 z-20 opacity-80 group-hover:opacity-100 transition-all duration-300"
                onClick={handleOpenAddModal}
              >
                <div className="w-7 h-7 rounded-full bg-quokka-purple/30 flex items-center justify-center hover:bg-quokka-purple hover:scale-110 transition-all duration-300">
                  <PlusCircle className="h-4 w-4 text-quokka-cyan" />
                </div>
              </div>
            )}
          </div>

          {/* Hover effect - gradient line at bottom */}
          <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-quokka-purple via-quokka-cyan to-quokka-purple absolute bottom-0 left-0 transition-all duration-500"></div>
        </div>

        {/* Add Game Modal */}
        <AddGameModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          onSuccess={handleSuccess}
          game={game}
        />
      </>
    );
  }

  if (variant === "grid") {
    return (
      <>
        <div
          className={cn(
            "group relative overflow-hidden rounded-xl bg-quokka-dark border border-quokka-purple/20 hover:border-quokka-purple/50 transition-all duration-300 select-none cursor-default hover:cursor-grab active:cursor-grabbing",
            className
          )}
        >
          {/* Game cover with gradient overlay */}
          <div className="relative aspect-[3/4]">
            <div className="absolute inset-0 bg-gradient-to-t from-quokka-darker to-transparent z-10" />
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={game.name}
              className="h-full w-full object-cover"
            />

            {/* Rating badge */}
            {game.total_rating && (
              <div className="absolute top-2 right-2 bg-quokka-darker/80 rounded-full px-2 py-1 flex items-center z-20">
                <Star className="h-3 w-3 text-quokka-cyan mr-1" />
                <span className="text-xs font-medium">
                  {(game.total_rating / 10).toFixed(1)}
                </span>
              </div>
            )}

            {/* Add button */}
            {showAddButton && (
              <div
                className="absolute right-2 bottom-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={handleOpenAddModal}
              >
                <div className="w-8 h-8 rounded-full bg-quokka-purple/70 flex items-center justify-center hover:bg-quokka-purple hover:scale-110 transition-all duration-300">
                  <PlusCircle className="h-5 w-5 text-white" />
                </div>
              </div>
            )}

            {/* Game details overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
              <h3
                className="text-lg font-bold text-white mb-1 group-hover:text-quokka-cyan transition-colors line-clamp-2"
                title={game.name}
              >
                {game.name}
              </h3>

              {/* Game genres for grid variant */}
              {game.genres && game.genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2 overflow-hidden">
                  {game.genres.slice(0, 2).map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-quokka-purple/20 rounded-full px-2 py-0.5 text-xs text-quokka-light/90 truncate max-w-[90px] inline-block"
                      title={genre.name}
                    >
                      {genre.name}
                    </span>
                  ))}
                  {game.genres.length > 2 && (
                    <span className="bg-quokka-purple/20 rounded-full px-2 py-0.5 text-xs text-quokka-light/90">
                      +{game.genres.length - 2}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between flex-wrap gap-y-1">
                {formattedDate && (
                  <div className="flex items-center text-xs text-quokka-light/90">
                    <Calendar className="h-3 w-3 mr-1 text-quokka-cyan" />
                    <span>
                      {new Date(game.first_release_date * 1000).getFullYear()}
                    </span>
                  </div>
                )}

                {game.platforms && game.platforms.length > 0 && (
                  <div className="flex items-center text-xs text-quokka-light/90">
                    <Gamepad className="h-3 w-3 mr-1 text-quokka-cyan" />
                    <span className="truncate max-w-[100px]">
                      {game.platforms.length > 1
                        ? `${game.platforms[0].name} +${
                            game.platforms.length - 1
                          }`
                        : game.platforms[0].name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hover effect - gradient line at bottom */}
          <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-quokka-purple via-quokka-cyan to-quokka-purple absolute bottom-0 left-0 transition-all duration-500"></div>
        </div>

        {/* Add Game Modal */}
        <AddGameModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          onSuccess={handleSuccess}
          game={game}
        />
      </>
    );
  }

  // Default variant
  return (
    <>
      <Card
        className={cn(
          "relative overflow-hidden group hover:bg-quokka-dark border border-quokka-purple/20 hover:border-quokka-purple/50 transition-all duration-300 aspect-[4/3] select-none cursor-default hover:cursor-grab active:cursor-grabbing",
          className
        )}
      >
        {/* Blurred background */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-xl brightness-50 scale-110"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-quokka-darker/60" />

        {/* Content */}
        <div className="relative h-full p-4 flex gap-6">
          {/* Game cover image */}
          <div className="relative w-1/2 flex-shrink-0 bg-black/40 rounded-lg overflow-hidden">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={game.name}
              className="h-full w-full rounded-lg shadow-lg"
              style={imageStyles}
            />

            {/* Rating badge */}
            {game.total_rating && (
              <div className="absolute bottom-2 left-2 bg-quokka-darker/80 rounded-full px-2 py-1 flex items-center z-20">
                <Star className="h-3 w-3 text-quokka-cyan mr-1" />
                <span className="text-xs font-medium">
                  {(game.total_rating / 10).toFixed(1)}
                </span>
              </div>
            )}

            <div className="absolute top-2 right-2 flex gap-2">
              <Link
                href={`/game/${game.id}`}
                className="bg-quokka-darker/60 p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-quokka-purple transition-all duration-200 z-10"
              >
                <ExternalLink className="w-5 h-5 text-white" />
              </Link>
              {showAddButton && (
                <button
                  onClick={handleOpenAddModal}
                  className="bg-quokka-darker/60 p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-quokka-purple transition-all duration-200 z-10"
                >
                  <PlusCircle className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Game information */}
          <div className="flex-1 flex flex-col text-white min-w-0 overflow-hidden">
            <h3
              className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-quokka-cyan transition-colors"
              title={game.name}
            >
              {game.name}
            </h3>

            <div className="space-y-2 flex-1 overflow-hidden">
              {formattedDate && (
                <div className="flex items-center gap-2 text-sm text-quokka-light/70">
                  <Calendar className="w-4 h-4 text-quokka-cyan flex-shrink-0" />
                  <span className="truncate">{formattedDate}</span>
                </div>
              )}

              {game.platforms && game.platforms.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-quokka-light/70">
                  <Gamepad className="w-4 h-4 text-quokka-cyan flex-shrink-0" />
                  <span className="truncate">
                    {game.platforms.length > 2
                      ? `${game.platforms[0].name} +${
                          game.platforms.length - 1
                        }`
                      : game.platforms.map((p) => p.name).join(", ")}
                  </span>
                </div>
              )}

              {game.summary && (
                <p className="text-sm text-quokka-light/70 line-clamp-3 overflow-hidden">
                  {game.summary}
                </p>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-auto pt-2 overflow-hidden">
              {game.genres?.slice(0, 3).map((genre) => (
                <Badge
                  key={genre.id}
                  variant="secondary"
                  className="bg-quokka-purple/20 hover:bg-quokka-purple/40 text-quokka-light/90 truncate max-w-[130px]"
                  title={genre.name}
                >
                  {genre.name}
                </Badge>
              ))}
              {game.genres && game.genres.length > 3 && (
                <Badge
                  variant="secondary"
                  className="bg-quokka-purple/20 hover:bg-quokka-purple/40 text-quokka-light/90"
                >
                  +{game.genres.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Hover effect - gradient line at bottom */}
        <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-quokka-purple via-quokka-cyan to-quokka-purple absolute bottom-0 left-0 transition-all duration-500"></div>
      </Card>

      {/* Add Game Modal */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSuccess={handleSuccess}
        game={game}
      />
    </>
  );
};

export default GameCard;
