/**
 * API route handler for getting detailed game information.
 * Returns full game data including all relationships from PostgreSQL.
 */

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import {
  DBGame,
  GameSearchResult,
  GameScreenshot,
  GameWebsite,
  GameMode,
  GameGenre,
  GamePlatform,
  GameCompany,
  GameKeyword,
} from "@/utils/types/game";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Game ID is required" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data: game, error } = await supabase
      .from("games")
      .select(
        `
        *,
        covers (
          id,
          url,
          width,
          height
        ),
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
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching game:", error);
      return NextResponse.json(
        { error: "Error fetching game details" },
        { status: 500 }
      );
    }

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const dbGame = game as DBGame;

    // Transform the data to match GameSearchResult interface
    const transformedGame: GameSearchResult = {
      id: dbGame.id,
      name: dbGame.name,
      slug: dbGame.slug,
      created_at: Number(dbGame.created_at) || 0,
      first_release_date: dbGame.first_release_date
        ? Number(dbGame.first_release_date)
        : undefined,
      summary: dbGame.summary || undefined,
      storyline: dbGame.storyline || undefined,
      total_rating: dbGame.total_rating || undefined,
      url: dbGame.url || undefined,
      cover: dbGame.covers
        ? {
            id: dbGame.covers.id,
            url: dbGame.covers.url,
            width: dbGame.covers.width || 0,
            height: dbGame.covers.height || 0,
          }
        : undefined,
      screenshots: dbGame.screenshots?.map((s: GameScreenshot) => ({
        id: s.id,
        url: s.url,
        width: s.width || 0,
        height: s.height || 0,
      })),
      websites: dbGame.websites?.map((w: GameWebsite) => ({
        id: w.id,
        type: w.type,
        url: w.url,
        trusted: w.trusted,
      })),
      game_modes: dbGame.game_to_modes?.map((m) => ({
        id: m.game_modes.id,
        name: m.game_modes.name,
        slug: m.game_modes.slug,
      })),
      genres: dbGame.game_to_genres?.map((g) => ({
        id: g.genres.id,
        name: g.genres.name,
        slug: g.genres.slug,
      })),
      platforms: dbGame.game_to_platforms?.map((p) => ({
        id: p.platforms.id,
        name: p.platforms.name,
        slug: p.platforms.slug,
      })),
      involved_companies: dbGame.involved_companies
        ? JSON.parse(dbGame.involved_companies)
            .map((ic: any) => ic.company.name)
            .join(", ")
        : undefined,
      keywords: dbGame.keywords
        ? JSON.parse(dbGame.keywords)
            .map((k: any) => k.name)
            .join(", ")
        : undefined,
      similar_games: dbGame.similar_games || undefined,
      game_types: dbGame.game_to_types?.map((t) => ({
        id: t.types.id,
        type: t.types.type,
      })),
    };

    return NextResponse.json(transformedGame);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching game details" },
      { status: 500 }
    );
  }
}
