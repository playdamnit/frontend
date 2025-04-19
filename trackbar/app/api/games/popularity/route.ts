import { NextResponse } from "next/server";
import {
  incrementGamePopularity,
  checkAndMarkPopular,
} from "@/utils/popularity";

const POPULARITY_THRESHOLD = 10; // Number of searches before considering a game popular
const POPULARITY_TTL = 7 * 24 * 60 * 60; // 7 days

type TrackingAction = "view" | "library" | "wishlist" | "rate";

export async function POST(request: Request) {
  try {
    const { gameId, action } = await request.json();
    console.log(
      `Received popularity tracking request for game ${gameId}, action: ${action}`
    );

    if (!gameId) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      );
    }

    if (!action || !["view", "library", "wishlist", "rate"].includes(action)) {
      return NextResponse.json(
        { error: "Valid action is required" },
        { status: 400 }
      );
    }

    // Different actions might have different rate limiting or increment values
    const increment = action === "view" ? 1 : 2; // Library/wishlist/rate counts more

    // Increment popularity counter
    const { count, rateLimited } = await incrementGamePopularity(
      gameId,
      increment
    );

    if (rateLimited) {
      return NextResponse.json({
        gameId,
        message: "Rate limited",
        currentCount: count,
        canTrack: false,
      });
    }

    // Check if game should be marked as popular
    await checkAndMarkPopular(gameId, count);

    return NextResponse.json({
      gameId,
      action,
      uniqueSearches: count,
      totalSearches: count,
      isPopular: count >= POPULARITY_THRESHOLD,
      canTrack: true,
    });
  } catch (error) {
    console.error("Popularity tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track game popularity" },
      { status: 500 }
    );
  }
}
