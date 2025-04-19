/**
 * Handles game search operations in PostgreSQL database.
 * Includes data transformation from database schema to unified search result format.
 */

import { createClient } from "@/utils/supabase/server";
import { DBGame, GameSearchResult } from "../types/game";
import { MAIN_GAME_TYPES } from "./igdb";

export const searchPostgres = async (
  query: string,
  showOnlyGames: boolean = true
): Promise<GameSearchResult[]> => {
  const supabase = await createClient();
  console.log(
    "Searching PostgreSQL for:",
    query,
    "showOnlyGames:",
    showOnlyGames
  );

  // Start building the query
  let postgresQuery = supabase
    .from("games")
    .select(
      `
      *,
      game_to_genres (
        genres (
          id,
          name,
          slug
        )
      ),
      game_to_platforms (
        platforms (
          id,
          name,
          slug
        )
      ),
      game_to_modes (
        game_modes (
          id,
          name,
          slug
        )
      ),
      game_to_types (
        types (
          id,
          type
        )
      ),
      screenshots (
        id,
        url,
        width,
        height
      ),
      websites (
        id,
        url,
        trusted,
        type: website_types (
          id,
          type
        )
      ),
      involved_companies_rel: game_to_companies (
        companies (
          id,
          name,
          slug
        )
      ),
      keywords_rel: game_to_keywords (
        keywords (
          id,
          name
        )
      )
    `
    )
    .ilike("name", `%${query}%`);

  if (showOnlyGames) {
    postgresQuery = postgresQuery.in("game_type", MAIN_GAME_TYPES);
  }

  const { data: games, error } = await postgresQuery.limit(30);

  if (error) {
    console.error("PostgreSQL search error:", error);
    return [];
  }

  return (games as unknown as DBGame[])
    .map((game): GameSearchResult | undefined => {
      try {
        return {
          id: game.id,
          name: game.name,
          slug: game.slug,
          created_at: Number(game.created_at) || 0,
          first_release_date: game.first_release_date
            ? Number(game.first_release_date)
            : undefined,
          summary: game.summary || undefined,
          storyline: game.storyline || undefined,
          total_rating: game.total_rating || undefined,
          url: game.url || undefined,
          cover: game.cover_url
            ? {
                id: Number(game.cover_id),
                url: game.cover_url,
                width: game.cover_width || 0,
                height: game.cover_height || 0,
              }
            : undefined,
          screenshots: game.screenshots?.map((s) => ({
            id: s.id,
            url: s.url,
            width: s.width || 0,
            height: s.height || 0,
          })),
          websites: game.websites?.map((w) => ({
            id: w.id,
            type: w.type,
            url: w.url,
            trusted: w.trusted,
          })),
          game_modes: game.game_to_modes?.map((m) => ({
            id: m.game_modes.id,
            name: m.game_modes.name,
            slug: m.game_modes.slug,
          })),
          genres: game.game_to_genres?.map((g) => ({
            id: g.genres.id,
            name: g.genres.name,
            slug: g.genres.slug,
          })),
          platforms: game.game_to_platforms?.map((p) => ({
            id: p.platforms.id,
            name: p.platforms.name,
            slug: p.platforms.slug,
          })),
          involved_companies: game.involved_companies
            ? JSON.parse(game.involved_companies)
                .map((ic: any) => ic.company.name)
                .join(", ")
            : undefined,
          keywords: game.keywords
            ? JSON.parse(game.keywords)
                .map((k: any) => k.name)
                .join(", ")
            : undefined,
          similar_games: game.similar_games || undefined,
          game_types: game.game_to_types?.map((t) => ({
            id: t.types.id,
            type: t.types.type,
          })),
        };
      } catch (error) {
        console.error(`Error transforming game ${game.id}:`, error);
        return undefined;
      }
    })
    .filter((game): game is GameSearchResult => game !== undefined);
};
