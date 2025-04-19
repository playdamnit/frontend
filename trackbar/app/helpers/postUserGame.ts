import { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/server";
import { getServerUser } from "@/utils/supabase/server-auth";

import { Database } from "@/types_db";

interface PostUserGameParams {
  gameId: number;
  status: Database["public"]["Enums"]["game_status"];
  rating: number;
  review?: string;
  platformId: number;
  source?: Database["public"]["Enums"]["game_source"];
  playtime?: number;
  gameDetails?: Database["public"]["Tables"]["games"]["Row"];
}

interface PostUserGameResponse {
  message: string;
  game: Database["public"]["Tables"]["user_games"]["Row"];
}

export async function postUserGame(
  params: PostUserGameParams
): Promise<PostUserGameResponse> {
  const {
    gameId,
    status,
    rating,
    review,
    platformId,
    source = "manual",
    playtime = 0,
    gameDetails,
  } = params;

  const user = await getServerUser();
  if (!user) {
    throw new Error("Authentication required");
  }

  const supabase = await createClient();

  await ensureGameExists(supabase, gameId, gameDetails);
  await checkGameNotInLibrary(supabase, user.id, gameId);

  const game = await addGameToLibrary(
    supabase,
    user.id,
    gameId,
    status,
    rating,
    review,
    platformId,
    source,
    playtime
  );

  return {
    message: "Game added to library successfully",
    game,
  };
}

async function ensureGameExists(
  supabase: SupabaseClient<Database>,
  gameId: number,
  gameDetails?: Database["public"]["Tables"]["games"]["Row"]
): Promise<void> {
  // Check if the game exists in the games table
  const { error: gameCheckError } = await supabase
    .from("games")
    .select("id")
    .eq("id", gameId)
    .single();

  // If the game doesn't exist and we have details, insert it
  if (gameCheckError && gameDetails) {
    console.log(`Game ${gameId} not found in database, inserting it first`);

    // Insert the game into the games table
    const { error: gameInsertError } = await supabase.from("games").insert({
      id: gameId,
      name: gameDetails.name,
      slug:
        gameDetails.slug || gameDetails.name.toLowerCase().replace(/\s+/g, "-"),
      summary: gameDetails.summary,
      storyline: gameDetails.storyline,
      first_release_date: gameDetails.first_release_date
        ? new Date(gameDetails.first_release_date * 1000).toISOString()
        : null,
      total_rating: gameDetails.total_rating,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (gameInsertError) {
      console.error("Error inserting game:", gameInsertError);
      throw new Error(
        `Failed to add game to database: ${gameInsertError.message}`
      );
    }

    // Insert cover if available
    if (gameDetails.cover && gameDetails.cover.url) {
      await supabase.from("covers").insert({
        game_id: gameId,
        url: gameDetails.cover.url,
        width: gameDetails.cover.width || 0,
        height: gameDetails.cover.height || 0,
      });
    }

    // Insert platforms if available
    if (gameDetails.platforms && gameDetails.platforms.length > 0) {
      await insertPlatforms(supabase, gameId, gameDetails.platforms);
    }

    // Insert genres if available
    if (gameDetails.genres && gameDetails.genres.length > 0) {
      await insertGenres(supabase, gameId, gameDetails.genres);
    }

    console.log(`Game ${gameId} inserted successfully`);
  }
}

/**
 * Insert platforms and link them to the game
 */
async function insertPlatforms(
  supabase: SupabaseClient<Database>,
  gameId: number,
  platforms: Array<{ id: number; name: string; slug?: string }>
): Promise<void> {
  for (const platform of platforms) {
    // Check if platform exists
    const { data: existingPlatform } = await supabase
      .from("platforms")
      .select("id")
      .eq("id", platform.id)
      .single();

    // Insert platform if it doesn't exist
    if (!existingPlatform) {
      await supabase.from("platforms").insert({
        id: platform.id,
        name: platform.name,
        slug: platform.slug || platform.name.toLowerCase().replace(/\s+/g, "-"),
      });
    }

    // Link platform to game
    await supabase.from("game_to_platforms").insert({
      game_id: gameId,
      platform_id: platform.id,
    });
  }
}

/**
 * Insert genres and link them to the game
 */
async function insertGenres(
  supabase: SupabaseClient<Database>,
  gameId: number,
  genres: Array<{ id: number; name: string; slug?: string }>
): Promise<void> {
  for (const genre of genres) {
    // Check if genre exists
    const { data: existingGenre } = await supabase
      .from("genres")
      .select("id")
      .eq("id", genre.id)
      .single();

    // Insert genre if it doesn't exist
    if (!existingGenre) {
      await supabase.from("genres").insert({
        id: genre.id,
        name: genre.name,
        slug: genre.slug || genre.name.toLowerCase().replace(/\s+/g, "-"),
      });
    }

    // Link genre to game
    await supabase.from("game_to_genres").insert({
      game_id: gameId,
      genre_id: genre.id,
    });
  }
}

/**
 * Check if the game already exists in the user's library
 */
async function checkGameNotInLibrary(
  supabase: SupabaseClient<Database>,
  userId: string,
  gameId: number
): Promise<void> {
  const { data: existingGame } = await supabase
    .from("user_games")
    .select("id")
    .eq("user_id", userId)
    .eq("game_id", gameId)
    .single();

  if (existingGame) {
    throw new Error("Game already exists in your library");
  }
}

/**
 * Add the game to the user's library
 */
async function addGameToLibrary(
  supabase: SupabaseClient<Database>,
  userId: string,
  gameId: number,
  status: Database["public"]["Enums"]["game_status"],
  rating: number,
  review?: string,
  platformId?: number,
  source: Database["public"]["Enums"]["game_source"] = "manual",
  playtime: number = 0
): Promise<Database["public"]["Tables"]["user_games"]["Row"]> {
  // Convert rating from 0-100 scale to 0-10 scale if needed
  const normalizedRating =
    rating > 10
      ? parseFloat((rating / 10).toFixed(1)) // Convert to 0-10 scale with one decimal place
      : parseFloat(rating.toFixed(1)); // Keep one decimal place

  // Insert the game into the user's library
  const { data, error } = await supabase
    .from("user_games")
    .insert({
      user_id: userId,
      game_id: gameId,
      status,
      rating: normalizedRating,
      review,
      platform_id: platformId,
      source,
      playtime_minutes: playtime,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding game to library:", error);
    throw new Error(`Failed to add game to library: ${error.message}`);
  }

  return data;
}
