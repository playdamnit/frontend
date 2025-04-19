import { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/server";
import { getServerUser } from "@/utils/supabase/server-auth";

import { Database } from "@/types_db";

interface UserGamesQueryParams {
  username: string;
  status?: Database["public"]["Enums"]["game_status"];
  platformId?: number;
  sort?: string;
  order?: string;
}

interface UserLookupResult {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
}

export async function getUserGames(params: UserGamesQueryParams) {
  const {
    username,
    status,
    platformId,
    sort = "created_at",
    order = "desc",
  } = params;
  const supabase = await createClient();
  const user = await getServerUser();
  console.log("Authenticated user:", user?.id || "none");

  const userId = username
    ? await fetchUserIdByUsername(supabase, username)
    : user?.id;

  if (!userId) {
    throw new Error("Username is required when not authenticated");
  }

  const games = await fetchUserGames(
    supabase,
    userId,
    status,
    platformId,
    sort,
    order
  );
  console.log(`Found ${games.length} games for user ${username}`);

  return {
    games,
  };
}

async function fetchUserIdByUsername(
  supabase: SupabaseClient<Database>,
  username: string
): Promise<string | null> {
  console.log("Looking up user by username:", username);
  const { data: userData, error } = await supabase.rpc("get_user_by_username", {
    p_username: username,
  });

  if (error || !userData) {
    console.warn("User not found by username");
    return null;
  }

  const typedUserData = userData as unknown as UserLookupResult;
  return typedUserData.id;
}

async function fetchUserGames(
  supabase: SupabaseClient<Database>,
  userId: string,
  status?: Database["public"]["Enums"]["game_status"],
  platformId?: number,
  sort: string = "created_at",
  order: string = "desc"
) {
  let query = supabase
    .from("user_games")
    .select(
      `
      *,
      games:game_id(
        id,
        name, 
        cover:covers (
          url
        ),
        game_to_genres (
          genres (
            name
          )
        ),
        game_to_platforms (
          platforms (
            name
          )
        ), 
        slug,
        summary,
        first_release_date,
        total_rating
        ),
      platforms:platform_id(id, name, slug)
    `
    )
    .eq("user_id", userId);

  if (status) query = query.eq("status", status);
  if (platformId) query = query.eq("platform_id", platformId);

  const { data, error } = await query.order(sort, {
    ascending: order === "asc",
  });

  if (error) {
    console.error("Error fetching user games:", error);
    throw new Error(`Failed to fetch games: ${error.message}`);
  }

  return data || [];
}
