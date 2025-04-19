import { getRedisClient } from "@/utils/redis";
import { createClient } from "@/utils/supabase/server";

export const POPULARITY_THRESHOLD = 10; // Number of searches before considering a game popular
export const POPULARITY_TTL = 7 * 24 * 60 * 60; // 7 days

// Helper function to increment game popularity in Redis
export const incrementGamePopularity = async (
  gameId: number,
  increment: number = 1
) => {
  const redis = getRedisClient();
  const key = `popularity:${gameId}`;
  const lastSearchKey = `last_search:${gameId}`;

  try {
    // Debug Redis connection
    const pingResult = await redis.ping();
    console.log("Redis connection test:", pingResult);

    // Debug current values
    const currentCount = await redis.get(key);
    const ttl = await redis.ttl(key);
    console.log(`Current state for game ${gameId}:`, {
      currentCount,
      ttl,
      key,
    });

    // Get the last search time
    const lastSearch = await redis.get(lastSearchKey);
    const now = Date.now();

    // If last search was less than 1 minute ago, rate limit
    if (lastSearch && now - parseInt(lastSearch) < 60000) {
      console.log(`Rate limited for game ${gameId}. Last search:`, {
        lastSearch: new Date(parseInt(lastSearch)),
        now: new Date(now),
        diff: now - parseInt(lastSearch),
      });
      return { count: parseInt(currentCount || "0"), rateLimited: true };
    }

    // Set last search time
    await redis.set(lastSearchKey, now.toString());

    // Increment counter with a single operation that also sets TTL
    const multi = redis.multi();
    multi.incrby(key, increment);
    multi.expire(key, POPULARITY_TTL);
    const results = await multi.exec();

    const newCount = results?.[0]?.[1] as number;

    // Verify the counter was incremented
    const verifyCount = await redis.get(key);
    const verifyTTL = await redis.ttl(key);

    console.log(`Redis operation results for game ${gameId}:`, {
      oldCount: currentCount,
      increment,
      newCount,
      verifyCount,
      verifyTTL,
      multiResults: results,
    });

    return { count: newCount, rateLimited: false };
  } catch (error) {
    console.error("Redis operation error:", error);
    // Return current count on error
    const fallbackCount = parseInt((await redis.get(key)) || "0");
    return { count: fallbackCount, rateLimited: false };
  }
};

// Helper function to check if game should be marked as popular
export const checkAndMarkPopular = async (
  gameId: number,
  searchCount: number
) => {
  if (searchCount >= POPULARITY_THRESHOLD) {
    const supabase = await createClient();
    console.log(
      `Marking game ${gameId} as popular with ${searchCount} searches`
    );

    // First check if it's already popular
    const { data: game, error: checkError } = await supabase
      .from("games")
      .select("is_popular")
      .eq("id", gameId)
      .single();

    if (checkError) {
      console.error(`Error checking game ${gameId} popularity:`, checkError);
      return;
    }

    if (game?.is_popular) {
      console.log(`Game ${gameId} is already marked as popular`);
      return;
    }

    // Update the game's popularity status in PostgreSQL
    const { error } = await supabase
      .from("games")
      .update({ is_popular: true })
      .eq("id", gameId);

    if (error) {
      console.error(`Error marking game ${gameId} as popular:`, error);
    } else {
      console.log(`Successfully marked game ${gameId} as popular`);
    }
  }
};
