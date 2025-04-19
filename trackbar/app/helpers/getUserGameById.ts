import { createClient } from "@/utils/supabase/server";
import { getServerUser } from "@/utils/supabase/server-auth";
import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/supabase-js";

// Interface for query parameters
export interface UserGameByIdParams {
  gameId: number;
  username?: string | null;
}

// Interface for the return data
export interface UserGameData {
  game: Database["public"]["Tables"]["user_games"]["Row"] | null;
  isOwnProfile: boolean;
  userId?: string;
}

/**
 * Helper function to get a single user game by ID
 * @param params Query parameters including gameId and optional username
 * @returns User game data and profile information
 */
export async function getUserGameById(
  params: UserGameByIdParams
): Promise<UserGameData> {
  const { gameId, username } = params;

  const supabase = await createClient();

  // Get the authenticated user (if any)
  const user = await getServerUser();

  let userId = null;

  // If username is provided, look up the corresponding user ID
  if (username) {
    console.log("Looking up user by username:", username);

    // Try to find the user by username using the RPC function
    const { data: userData, error: userError } = await supabase.rpc(
      "get_user_by_username",
      {
        p_username: username,
      }
    );

    if (userError || !userData) {
      console.log("User not found by username, returning null");
      // If user not found, return null game
      return {
        game: null,
        isOwnProfile: false,
      };
    }

    // userData is a JSON object with id property
    userId = (userData as { id: string }).id;
    console.log("Found user ID:", userId);
  } else {
    // If no username provided, use the authenticated user's ID
    userId = user ? user.id : null;
    console.log("Using authenticated user ID:", userId);
  }

  // Ensure we have a user ID to query
  if (!userId) {
    throw new Error("Username is required when not authenticated");
  }

  // Get the game from the user's library
  const { data, error } = await supabase
    .from("user_games")
    .select(
      `
      *,
      games:game_id(id, name, slug, summary, first_release_date, total_rating),
      platforms:platform_id(id, name, slug)
    `
    )
    .eq("user_id", userId)
    .eq("game_id", gameId)
    .single();

  // Handle the case where the game is not found
  if (error) {
    if (error.code === "PGRST116") {
      // Game not found in user's library
      return {
        game: null,
        isOwnProfile: user?.id === userId,
        userId,
      };
    }

    console.error("Error fetching user game:", error);
    throw new Error(`Failed to fetch game: ${error.message}`);
  }

  return {
    game: data as Database["public"]["Tables"]["user_games"]["Row"],
    isOwnProfile: user?.id === userId,
    userId,
  };
}
