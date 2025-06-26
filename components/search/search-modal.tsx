"use client";

import { useState } from "react";
import { Search, Star, Calendar, Plus, Gamepad2 } from "lucide-react";
import { Game, useGetApiGamesSearch } from "@playdamnit/api-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameSelect?: (game: Game) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  onGameSelect,
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults, isLoading } = useGetApiGamesSearch(
    { q: searchQuery },
    {
      query: {
        enabled: searchQuery.length > 2,
        queryKey: ["games", "search", searchQuery],
      },
    }
  );

  const handleGameSelect = (game: Game) => {
    if (onGameSelect) {
      onGameSelect(game);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-playdamnit-dark border-playdamnit-purple/30 text-playdamnit-light max-w-2xl h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-0 flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-playdamnit-light flex items-center gap-2">
            <Search className="w-5 h-5 text-playdamnit-cyan" />
            Add Game to Library
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-6 pt-6 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-playdamnit-light/40" />
            <input
              type="text"
              placeholder="Search for games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-playdamnit-purple/30 bg-playdamnit-dark py-3 pl-10 pr-4 text-playdamnit-light placeholder-playdamnit-light/40 focus:border-playdamnit-cyan focus:outline-none focus:ring-1 focus:ring-playdamnit-cyan transition-colors"
              autoFocus
            />
          </div>
        </div>

        {/* Scrollable Results */}
        <div className="px-6 pb-6 pt-4 overflow-y-auto flex-1 min-h-0">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 bg-playdamnit-dark/50 border border-playdamnit-purple/20 rounded-lg animate-pulse"
                >
                  <div className="w-16 h-20 bg-playdamnit-purple/20 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-playdamnit-purple/20 rounded w-3/4" />
                    <div className="h-4 bg-playdamnit-purple/20 rounded w-1/2" />
                    <div className="flex gap-2">
                      <div className="h-6 bg-playdamnit-purple/20 rounded-full w-16" />
                      <div className="h-6 bg-playdamnit-purple/20 rounded-full w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults?.data?.results &&
            searchResults.data.results.length > 0 ? (
            <div className="space-y-3">
              {searchResults.data.results.map((game) => (
                <div
                  key={game.id}
                  onClick={() => handleGameSelect(game)}
                  className="group flex gap-4 p-4 bg-playdamnit-dark/30 border border-playdamnit-purple/20 rounded-lg hover:border-playdamnit-cyan/50 hover:bg-playdamnit-dark/50 transition-all duration-200 cursor-pointer"
                >
                  {/* Game Cover */}
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-playdamnit-dark flex-shrink-0">
                    {game.cover?.url ? (
                      <img
                        src={game.cover.url.replace("t_thumb", "t_cover_big")}
                        alt={game.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-playdamnit-light/30">
                        <Gamepad2 className="w-6 h-6" />
                      </div>
                    )}
                    {game.totalRating && (
                      <div className="absolute bottom-1 left-1 bg-playdamnit-dark/80 rounded px-1 py-0.5 flex items-center">
                        <Star className="w-2.5 h-2.5 text-playdamnit-cyan mr-0.5" />
                        <span className="text-xs text-playdamnit-light">
                          {(game.totalRating / 10).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Game Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-playdamnit-light group-hover:text-playdamnit-cyan transition-colors line-clamp-1 mb-1">
                      {game.name}
                    </h3>

                    <div className="flex items-center gap-3 text-sm text-playdamnit-light/60 mb-2">
                      {game.firstReleaseDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(
                              game.firstReleaseDate * 1000
                            ).getFullYear()}
                          </span>
                        </div>
                      )}
                      {game.platforms?.[0] && (
                        <div className="flex items-center gap-1">
                          <Gamepad2 className="w-3 h-3" />
                          <span className="truncate">
                            {game.platforms[0].name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {game.genres?.slice(0, 3).map((genre) => (
                        <Badge
                          key={genre.id}
                          variant="outline"
                          className="text-xs bg-playdamnit-purple/10 border-playdamnit-purple/30 text-playdamnit-light/70"
                        >
                          {genre.name}
                        </Badge>
                      ))}
                      {game.genres && game.genres.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-playdamnit-purple/10 border-playdamnit-purple/30 text-playdamnit-light/70"
                        >
                          +{game.genres.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Add Button */}
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-playdamnit-cyan/20 group-hover:bg-playdamnit-cyan group-hover:scale-110 flex items-center justify-center transition-all duration-200">
                      <Plus className="w-4 h-4 text-playdamnit-cyan group-hover:text-playdamnit-dark" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery.length > 2 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-playdamnit-purple/10 flex items-center justify-center">
                <Search className="w-8 h-8 text-playdamnit-light/40" />
              </div>
              <p className="text-playdamnit-light/60 mb-2">No games found</p>
              <p className="text-sm text-playdamnit-light/40">
                Try a different search term
              </p>
            </div>
          ) : searchQuery.length > 0 ? (
            <div className="text-center py-8 text-playdamnit-light/60">
              <p>Type at least 3 characters to search</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-playdamnit-cyan/10 flex items-center justify-center">
                <Search className="w-8 h-8 text-playdamnit-cyan" />
              </div>
              <p className="text-playdamnit-light/70 mb-2">
                Search for games to add
              </p>
              <p className="text-sm text-playdamnit-light/40">
                Start typing to find games in our database
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
