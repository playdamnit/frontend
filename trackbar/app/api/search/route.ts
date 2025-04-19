/**
 * API route handler for game search functionality.
 * Orchestrates search operations across IGDB API and local PostgreSQL database with Redis caching.
 */

import { NextResponse } from "next/server";
import { getGameSearchCache, setGameSearchCache } from "@/utils/redis";
import { searchPostgres } from "@/utils/search/postgres";
import { searchIGDB } from "@/utils/search/igdb";
import { createClient } from "@/utils/supabase/server";
import { deduplicateGames } from "@/utils/search/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  // Parse showOnlyGames parameter, default to true if not provided or invalid
  const showOnlyGames = searchParams.get("showOnlyGames") !== "false";

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Step 1: Check Redis cache
    console.log("Checking Redis cache...");
    // Include showOnlyGames in the cache key to ensure different results are cached separately
    const cacheKey = `${query}:${showOnlyGames}`;
    const cachedResults = await getGameSearchCache(cacheKey);
    if (cachedResults) {
      console.log("Cache hit! Returning cached results");
      return NextResponse.json(cachedResults);
    }
    console.log("Cache miss, proceeding with search");

    // Step 2: Parallel search in PostgreSQL and IGDB
    console.log("Starting parallel search...");
    const [postgresResults, igdbResults] = await Promise.all([
      searchPostgres(query, showOnlyGames),
      searchIGDB(query, showOnlyGames),
    ]);

    console.log("Search results:", {
      postgresResultsCount: postgresResults.length,
      igdbResultsCount: igdbResults.length,
      showOnlyGames,
    });

    // Step 3: Merge and deduplicate results
    const allResults = deduplicateGames([...postgresResults, ...igdbResults]);
    console.log("Total deduplicated results:", allResults.length);

    // Step 4: Cache the results
    await setGameSearchCache(cacheKey, allResults);

    // Step 5: Store IGDB results in PostgreSQL using PGMQ
    if (igdbResults.length > 0) {
      const supabase = await createClient();
      let enqueuedCount = 0;

      // Send each game to the queue
      for (const game of igdbResults) {
        const { data: msgId, error } = await supabase.rpc("enqueue_game", {
          p_queue_name: "game_store_queue",
          p_message: game,
        });

        if (error) {
          console.error("Error enqueueing game:", error);
        } else if (msgId) {
          // Only increment if message was actually enqueued (not a duplicate)
          enqueuedCount++;
        }
      }

      console.log(`Enqueued ${enqueuedCount} new games for processing`);
    }

    return NextResponse.json(allResults);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "An error occurred while searching for games" },
      { status: 500 }
    );
  }
}
