import { useCallback } from "react";

type TrackingAction = "view" | "library" | "wishlist" | "rate";

export const useTrackGamePopularity = () => {
  const trackPopularity = useCallback(
    async (gameId: number, action: TrackingAction) => {
      try {
        const response = await fetch("/api/games/popularity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gameId, action }),
        });

        if (!response.ok) {
          console.error(
            "Failed to track game popularity:",
            await response.json()
          );
        }
      } catch (error) {
        console.error("Error tracking game popularity:", error);
      }
    },
    []
  );

  return {
    trackGameView: (gameId: number) => trackPopularity(gameId, "view"),
    trackGameLibrary: (gameId: number) => trackPopularity(gameId, "library"),
    trackGameWishlist: (gameId: number) => trackPopularity(gameId, "wishlist"),
    trackGameRating: (gameId: number) => trackPopularity(gameId, "rate"),
  };
};
