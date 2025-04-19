/**
 * Handles storing IGDB search results into PostgreSQL database.
 * Manages data persistence for games and their related entities (genres, platforms, screenshots, etc.).
 */

import { createClient } from "@/utils/supabase/server";
import { GameSearchResult, GameCompany, GameKeyword } from "../types/game";

export const storeIGDBResults = async (games: GameSearchResult[]) => {
  const supabase = await createClient();

  for (const game of games) {
    // Store main game data
    const { error } = await supabase.from("games").upsert(
      {
        id: game.id,
        name: game.name,
        slug: game.slug,
        summary: game.summary,
        storyline: game.storyline,
        first_release_date: game.first_release_date,
        created_at: game.created_at,
        total_rating: game.total_rating,
        involved_companies: game.involved_companies || null,
        keywords: game.keywords || null,
        similar_games: game.similar_games || null,
        updated_at: new Date(),
      },
      {
        onConflict: "id",
      }
    );

    if (error) {
      console.error(`Error storing game ${game.id} in PostgreSQL:`, error);
      continue;
    }

    // Store cover
    if (game.cover) {
      const { error: coverError } = await supabase.from("covers").upsert({
        id: game.cover.id,
        game_id: game.id,
        url: game.cover.url,
        width: game.cover.width || null,
        height: game.cover.height || null,
      });
      if (coverError) {
        console.error(`Error storing cover for game ${game.id}:`, coverError);
      }
    }

    // Store game modes relationships
    if (game.game_modes && game.game_modes.length > 0) {
      const { error: modesError } = await supabase.from("game_to_modes").upsert(
        game.game_modes.map((mode) => ({
          game_id: game.id,
          mode_id: mode.id,
        }))
      );
      if (modesError) {
        console.error(
          `Error storing game modes for game ${game.id}:`,
          modesError
        );
      }
    }

    // Store genre relationships
    if (game.genres && game.genres.length > 0) {
      const { error: genresError } = await supabase
        .from("game_to_genres")
        .upsert(
          game.genres.map((genre) => ({
            game_id: game.id,
            genre_id: genre.id,
          }))
        );
      if (genresError) {
        console.error(`Error storing genres for game ${game.id}:`, genresError);
      }
    }

    // Store platform relationships
    if (game.platforms && game.platforms.length > 0) {
      const { error: platformsError } = await supabase
        .from("game_to_platforms")
        .upsert(
          game.platforms.map((platform) => ({
            game_id: game.id,
            platform_id: platform.id,
          }))
        );
      if (platformsError) {
        console.error(
          `Error storing platforms for game ${game.id}:`,
          platformsError
        );
      }
    }

    // Store game types relationships
    if (game.game_types && game.game_types.length > 0) {
      const { error: typesError } = await supabase.from("game_to_types").upsert(
        game.game_types.map((type) => ({
          game_id: game.id,
          type_id: type.id,
        }))
      );
      if (typesError) {
        console.error(
          `Error storing game types for game ${game.id}:`,
          typesError
        );
      }
    }

    // Store screenshots
    if (game.screenshots && game.screenshots.length > 0) {
      const { error: screenshotsError } = await supabase
        .from("screenshots")
        .upsert(
          game.screenshots.map((screenshot) => ({
            id: screenshot.id,
            game_id: game.id,
            url: screenshot.url,
            width: screenshot.width || null,
            height: screenshot.height || null,
          }))
        );
      if (screenshotsError) {
        console.error(
          `Error storing screenshots for game ${game.id}:`,
          screenshotsError
        );
      }
    }

    // Store websites
    if (game.websites && game.websites.length > 0) {
      const { error: websitesError } = await supabase.from("websites").upsert(
        game.websites.map((website) => ({
          id: website.id,
          game_id: game.id,
          url: website.url,
          trusted: website.trusted,
          type_id: website.type.id,
        }))
      );
      if (websitesError) {
        console.error(
          `Error storing websites for game ${game.id}:`,
          websitesError
        );
      }
    }
  }
};
