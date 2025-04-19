"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Star, Heart, Clock, Plus, ChevronDown, Trophy } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IGDBGame } from "@/adapters/igdb";
import AddGameModal from "@/components/AddGameModal";

interface GameChartsProps {
  title?: string;
  icon?: React.ReactNode;
  games: IGDBGame[];
  activeTab?: "popular" | "rated" | "wanted";
  className?: string;
}

const GameCharts: React.FC<GameChartsProps> = ({
  title = "MGL Charts",
  icon = <Trophy className="w-6 h-6 text-quokka-cyan" />,
  games = [],
  activeTab = "popular",
  className,
}) => {
  const [currentTab, setCurrentTab] = useState<"popular" | "rated" | "wanted">(
    activeTab
  );
  const [visibleGames, setVisibleGames] = useState<number>(10);
  const [sortedGames, setSortedGames] = useState<IGDBGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<IGDBGame | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter or sort games based on the active tab
  useEffect(() => {
    if (!games || games.length === 0) {
      setSortedGames([]);
      return;
    }

    let filtered: IGDBGame[] = [];

    switch (currentTab) {
      case "popular":
        // Sort by popularity (using total_rating as a proxy for popularity)
        filtered = [...games].sort(
          (a, b) => (b.total_rating || 0) - (a.total_rating || 0)
        );
        break;
      case "rated":
        // Sort by rating
        filtered = [...games].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "wanted":
        // For "wanted", we could sort by release date for upcoming games
        filtered = [...games].sort((a, b) => {
          // If no release date, put at the end
          if (!a.first_release_date) return 1;
          if (!b.first_release_date) return -1;
          // Sort by closest release date
          return a.first_release_date - b.first_release_date;
        });
        break;
      default:
        filtered = games;
    }

    setSortedGames(filtered);
  }, [games, currentTab]);

  // Handle tab change
  const handleTabChange = (tab: "popular" | "rated" | "wanted") => {
    setCurrentTab(tab);
    // Reset visible games count when changing tabs
    setVisibleGames(10);
  };

  // Handle show more button click
  const handleShowMore = () => {
    setVisibleGames((prev) => Math.min(prev + 10, sortedGames.length));
  };

  // Handle opening the add game modal
  const handleOpenAddModal = (e: React.MouseEvent, game: IGDBGame) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedGame(game);
    setIsAddModalOpen(true);
  };

  // Handle closing the add game modal
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedGame(null);
  };

  // Handle successful addition of a game
  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    setSelectedGame(null);
    // You could add additional success handling here if needed
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Gradient accent line at top */}
      <div className="h-1 w-full bg-gradient-to-r from-quokka-purple via-quokka-cyan to-quokka-purple absolute top-0 left-0 z-10"></div>

      <Card className="bg-quokka-darker border-quokka-purple/20 overflow-hidden rounded-xl shadow-lg">
        {/* Header with title and tabs */}
        <div className="p-6 border-b border-quokka-purple/20">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-quokka-purple/20 flex items-center justify-center">
                {icon}
              </div>
              <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-3 overflow-x-auto pb-1">
            <button
              onClick={() => handleTabChange("popular")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                currentTab === "popular"
                  ? "bg-gradient-to-r from-quokka-purple to-quokka-purple/80 text-white shadow-md"
                  : "bg-quokka-purple/20 text-quokka-light/70 hover:bg-quokka-purple/30"
              )}
            >
              <Heart className="w-4 h-4" />
              <span>Most Popular</span>
            </button>
            <button
              onClick={() => handleTabChange("rated")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                currentTab === "rated"
                  ? "bg-gradient-to-r from-quokka-purple to-quokka-purple/80 text-white shadow-md"
                  : "bg-quokka-purple/20 text-quokka-light/70 hover:bg-quokka-purple/30"
              )}
            >
              <Star className="w-4 h-4" />
              <span>Highest Rated</span>
            </button>
            <button
              onClick={() => handleTabChange("wanted")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                currentTab === "wanted"
                  ? "bg-gradient-to-r from-quokka-purple to-quokka-purple/80 text-white shadow-md"
                  : "bg-quokka-purple/20 text-quokka-light/70 hover:bg-quokka-purple/30"
              )}
            >
              <Clock className="w-4 h-4" />
              <span>Most Wanted</span>
            </button>
          </div>
        </div>

        {/* Game list */}
        <div className="divide-y divide-quokka-purple/10">
          {sortedGames.slice(0, visibleGames).map((game, index) => {
            const imageUrl = game.cover?.url
              ? game.cover.url.startsWith("https:")
                ? game.cover.url.replace("t_thumb", "t_cover_small")
                : `https:${game.cover.url.replace("t_thumb", "t_cover_small")}`
              : "/placeholder.svg";

            // Determine medal color for top 3 positions
            let medalColor = "";
            if (index === 0) medalColor = "text-yellow-400";
            else if (index === 1) medalColor = "text-gray-300";
            else if (index === 2) medalColor = "text-amber-600";

            return (
              <Link href={`/game/${game.id}`} key={game.id}>
                <div className="flex items-center p-4 hover:bg-quokka-purple/10 transition-colors group cursor-pointer">
                  {/* Rank number with special styling for top 3 */}
                  <div className="w-10 flex-shrink-0 text-center">
                    <span
                      className={cn(
                        "text-xl font-bold transition-colors",
                        medalColor ||
                          "text-quokka-light/50 group-hover:text-quokka-cyan"
                      )}
                    >
                      {index + 1}
                    </span>
                  </div>

                  {/* Game cover */}
                  <div className="w-14 h-18 flex-shrink-0 mr-4 overflow-hidden rounded-md border border-quokka-purple/20 group-hover:border-quokka-purple/50 transition-all shadow-sm">
                    <img
                      src={imageUrl}
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Game info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-lg line-clamp-1 group-hover:text-quokka-cyan transition-colors">
                      {game.name}
                    </h3>

                    {/* Game genres */}
                    {game.genres && game.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {game.genres.slice(0, 2).map((genre, idx) => (
                          <span
                            key={idx}
                            className="bg-quokka-purple/20 rounded-full px-2.5 py-0.5 text-xs text-quokka-light/70"
                          >
                            {genre.name}
                          </span>
                        ))}
                        {game.genres.length > 2 && (
                          <span className="bg-quokka-purple/20 rounded-full px-2.5 py-0.5 text-xs text-quokka-light/70">
                            +{game.genres.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Rating or metric */}
                  {game.total_rating && (
                    <div className="flex-shrink-0 ml-2 bg-quokka-dark/80 rounded-full px-3 py-1.5 flex items-center shadow-sm">
                      <Star className="h-4 w-4 text-quokka-cyan mr-1.5" />
                      <span className="text-sm font-medium text-white">
                        {(game.total_rating / 10).toFixed(1)}
                      </span>
                    </div>
                  )}

                  {/* Add button */}
                  <button
                    className="ml-4 w-10 h-10 rounded-full bg-quokka-purple/20 flex items-center justify-center hover:bg-quokka-purple transition-all duration-300 text-white opacity-0 group-hover:opacity-100 shadow-sm"
                    onClick={(e) => handleOpenAddModal(e, game)}
                    aria-label="Add game to collection"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Show more button - only show if there are more games to display */}
        {visibleGames < sortedGames.length && (
          <div className="p-6 border-t border-quokka-purple/20">
            <button
              className="w-full py-3 rounded-lg bg-gradient-to-r from-quokka-purple/90 to-quokka-purple/70 text-white hover:from-quokka-purple hover:to-quokka-purple/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
              onClick={handleShowMore}
            >
              <span className="font-medium">Show More</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </Card>

      {/* Add Game Modal */}
      {selectedGame && (
        <AddGameModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          onSuccess={handleAddSuccess}
          game={selectedGame}
        />
      )}
    </div>
  );
};

export default GameCharts;
