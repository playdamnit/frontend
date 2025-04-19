"use client";

import { useState } from "react";
import {
  Search,
  Loader2,
  ArrowLeft,
  Star,
  Calendar,
  Plus,
  Gamepad,
} from "lucide-react";
import { GameSearchResult } from "@/utils/types/game";
import { useGameSearch } from "@/hooks/useGameSearch";
import AddGameModal from "../AddGameModal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Logo } from "../ui/logo";

// Custom scrollbar styles
const scrollbarStyles = `
  scrollbar-thin
  scrollbar-thumb-quokka-purple/40
  scrollbar-track-quokka-dark
  hover:scrollbar-thumb-quokka-purple/60
  scrollbar-thumb-rounded-full
  scrollbar-track-rounded-full
  overflow-y-auto
  overflow-x-hidden
`;

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameSelect?: (game: GameSearchResult) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  onGameSelect,
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<GameSearchResult | null>(
    null
  );

  const { data: searchResults, isLoading } = useGameSearch({
    query: searchQuery,
    enabled: searchQuery.length > 2,
  });

  const handleGameSelect = (game: GameSearchResult) => {
    setSelectedGame(game);
    // If onGameSelect is provided, call it with the selected game
    if (onGameSelect) {
      onGameSelect(game);
    }
    // We don't need to open another modal, just update the selected game
  };

  const handleGameAdded = () => {
    setSelectedGame(null);
    onClose();
  };

  const handleBackToSearch = () => {
    setSelectedGame(null);
  };

  // Determine which content to show based on whether a game is selected
  const showSearchContent = !selectedGame;

  // Custom gamepad icon for platforms
  const PlatformIcon = () => (
    <Gamepad size={14} className="text-quokka-cyan mr-1" />
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // Reset state when closing
          setSelectedGame(null);
          setSearchQuery("");
          onClose();
        }
      }}
    >
      <DialogContent className="bg-quokka-darker border border-quokka-purple/20 text-white max-w-2xl p-0 overflow-hidden">
        {/* Gradient accent line at top */}
        <div className="h-1 w-full bg-gradient-to-r from-quokka-purple via-quokka-cyan to-quokka-purple"></div>

        {showSearchContent ? (
          <div className="p-6 space-y-6">
            <DialogTitle className="text-xl font-bold text-white flex items-center">
              <Logo size={24} />
              <span className="ml-2">Search Games</span>
            </DialogTitle>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-quokka-purple/20 bg-quokka-dark py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:border-quokka-purple focus:outline-none focus:ring-1 focus:ring-quokka-purple text-lg"
                autoFocus
              />
            </div>

            <div
              className={cn(
                "space-y-4 max-h-[60vh] overflow-y-auto pr-2",
                scrollbarStyles
              )}
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(147, 51, 234, 0.4) #1a1a1a",
              }}
            >
              {isLoading ? (
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="relative overflow-hidden rounded-xl bg-quokka-dark border border-quokka-purple/10 animate-pulse"
                    >
                      <div className="flex">
                        {/* Skeleton for game cover */}
                        <div className="relative w-[100px] h-[140px] flex-shrink-0 bg-quokka-purple/5 overflow-hidden">
                          {/* Shimmer effect */}
                          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-quokka-purple/10 to-transparent animate-shimmer"></div>

                          {/* Rating skeleton */}
                          <div className="absolute bottom-2 left-2 bg-quokka-darker/50 rounded-full w-12 h-5"></div>
                        </div>

                        {/* Skeleton for game details */}
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            <div className="relative h-6 bg-quokka-purple/5 rounded w-3/4 mb-4 overflow-hidden">
                              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-quokka-purple/10 to-transparent animate-shimmer"></div>
                            </div>
                            <div className="relative h-4 bg-quokka-purple/5 rounded w-1/2 mb-2 overflow-hidden">
                              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-quokka-purple/10 to-transparent animate-shimmer"></div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <div className="relative h-6 bg-quokka-purple/5 rounded-full w-16 overflow-hidden">
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-quokka-purple/10 to-transparent animate-shimmer"></div>
                              </div>
                              <div className="relative h-6 bg-quokka-purple/5 rounded-full w-16 overflow-hidden">
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-quokka-purple/10 to-transparent animate-shimmer"></div>
                              </div>
                              <div className="relative h-6 bg-quokka-purple/5 rounded-full w-10 overflow-hidden">
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-quokka-purple/10 to-transparent animate-shimmer"></div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-4 mt-4">
                            <div className="relative h-4 bg-quokka-purple/5 rounded w-20 flex items-center overflow-hidden">
                              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-quokka-purple/10 to-transparent animate-shimmer"></div>
                              <div className="w-3 h-3 mr-1 bg-quokka-purple/10 rounded-full z-10"></div>
                              <div className="flex-1 bg-quokka-purple/5 h-3 rounded z-10"></div>
                            </div>
                            <div className="relative h-4 bg-quokka-purple/5 rounded w-32 flex items-center overflow-hidden">
                              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-quokka-purple/10 to-transparent animate-shimmer"></div>
                              <div className="w-3 h-3 mr-1 bg-quokka-purple/10 rounded-full z-10"></div>
                              <div className="flex-1 bg-quokka-purple/5 h-3 rounded z-10"></div>
                            </div>
                          </div>
                        </div>

                        {/* Add button skeleton */}
                        <div className="absolute right-4 top-4">
                          <div className="relative w-8 h-8 rounded-full bg-quokka-purple/10 overflow-hidden">
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-quokka-purple/10 to-transparent animate-shimmer"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {searchResults.map((game) => (
                    <div
                      key={game.id}
                      className="group relative overflow-hidden rounded-xl bg-quokka-dark border border-quokka-purple/20 hover:border-quokka-purple/50 transition-all duration-300 cursor-pointer"
                      onClick={() => handleGameSelect(game)}
                    >
                      <div className="flex">
                        {/* Game cover with gradient overlay */}
                        <div className="relative w-[100px] h-[140px] flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-quokka-dark/30 z-10" />
                          <img
                            src={game.cover?.url || "/placeholder.svg"}
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
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-quokka-cyan transition-colors line-clamp-2 pr-10">
                              {game.name}
                            </h3>

                            {/* Game metadata with icons */}
                            <div className="space-y-2">
                              {game.genres && game.genres.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {game.genres.slice(0, 2).map((genre) => (
                                    <span
                                      key={genre.id}
                                      className="bg-quokka-purple/20 rounded-full px-3 py-1 text-xs text-quokka-light/70"
                                    >
                                      {genre.name}
                                    </span>
                                  ))}
                                  {game.genres.length > 2 && (
                                    <span className="bg-quokka-purple/20 rounded-full px-3 py-1 text-xs text-quokka-light/70">
                                      +{game.genres.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center mt-3 text-sm text-quokka-light/70 gap-4">
                            {game.first_release_date && (
                              <div className="flex items-center">
                                <Calendar className="h-3.5 w-3.5 mr-1 text-quokka-cyan" />
                                <span>
                                  {new Date(
                                    game.first_release_date * 1000
                                  ).getFullYear()}
                                </span>
                              </div>
                            )}

                            {game.platforms && game.platforms.length > 0 && (
                              <div className="flex items-center">
                                <PlatformIcon />
                                <span className="truncate max-w-[150px]">
                                  {game.platforms.length > 2
                                    ? `${game.platforms[0].name} +${
                                        game.platforms.length - 1
                                      }`
                                    : game.platforms
                                        .map((p) => p.name)
                                        .join(", ")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Add button */}
                        <div
                          className="absolute right-4 top-4 z-20 opacity-80 group-hover:opacity-100 transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGameSelect(game);
                          }}
                        >
                          <div className="w-8 h-8 rounded-full bg-quokka-purple/30 flex items-center justify-center hover:bg-quokka-purple hover:scale-110 transition-all duration-300">
                            <Plus className="h-5 w-5 text-quokka-cyan" />
                          </div>
                        </div>
                      </div>

                      {/* Hover effect - gradient line at bottom */}
                      <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-quokka-purple via-quokka-cyan to-quokka-purple absolute bottom-0 left-0 transition-all duration-500"></div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.length > 2 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No games found</p>
                  <p className="text-sm mt-2">Try a different search term</p>
                </div>
              ) : searchQuery.length > 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>Type at least 3 characters to search</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-quokka-purple/20 flex items-center justify-center">
                    <Search className="h-8 w-8 text-quokka-cyan" />
                  </div>
                  <p className="text-quokka-light/70">
                    Start typing to search for games
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Back button */}
            <button
              onClick={handleBackToSearch}
              className="absolute left-0 top-0 z-20 flex items-center text-quokka-light/70 hover:text-quokka-cyan transition-colors bg-quokka-darker/90 px-3 py-2 rounded-tr-lg rounded-bl-lg"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>Back to search</span>
            </button>

            {/* If a game is selected, render the AddGameModal content directly */}
            <AddGameModal
              isOpen={true}
              onClose={() => setSelectedGame(null)}
              onSuccess={handleGameAdded}
              game={selectedGame}
              isEmbedded={true}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
