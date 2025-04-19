/**
 * Utility functions for game search operations.
 * Includes helper functions for data processing and manipulation.
 */

import { GameSearchResult } from "../types/game";

export const deduplicateGames = (
  games: GameSearchResult[]
): GameSearchResult[] => {
  const seen = new Set();
  return games.filter((game) => {
    if (seen.has(game.id)) {
      return false;
    }
    seen.add(game.id);
    return true;
  });
};
