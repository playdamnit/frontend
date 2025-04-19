import { NextResponse, NextRequest } from "next/server";
import { IgdbGames } from "./types";
import { MAIN_GAME_TYPES } from "@/utils/search/igdb";

const clientId = process.env.TWITCH_CLIENT_ID;
const accessToken = process.env.TWITCH_ACCESS_TOKEN;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");
  const showOnlyGames = searchParams.get("showOnlyGames") !== "false";

  if (!name) {
    return NextResponse.json(
      { error: "'name' parameter is required" },
      { status: 400 }
    );
  }

  if (!clientId || !accessToken) {
    return NextResponse.json(
      { error: "TWITCH credentials are not set" },
      { status: 500 }
    );
  }

  const url = "https://api.igdb.com/v4/games";
  const headers = {
    "Client-ID": process.env.TWITCH_CLIENT_ID ?? "",
    Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
  };

  // Build the query body
  let bodyQuery = `
    fuzzy_search "${name}";
    fields id, name, slug, alternative_names.name, created_at, game_type.type, genres.name, genres.slug, platforms.name, platforms.slug, first_release_date, keywords.name,
           cover.url, cover.width, cover.height, screenshots.url, screenshots.width, screenshots.height,
           websites.type.id, websites.type.type, websites.url, websites.trusted, game_modes, total_rating, similar_games, storyline, summary,
           url, involved_companies.company.name, involved_companies.company.slug, game_modes.name,game_modes.slug;
  `;

  // Add game type filter if showOnlyGames is true
  if (showOnlyGames) {
    bodyQuery += `where game_type = (${MAIN_GAME_TYPES.join(", ")});`;
  }

  bodyQuery += `limit 50;`;

  try {
    console.log("IGDB search:", { name, showOnlyGames });

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: bodyQuery,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as IgdbGames[];

    if (data && data.length > 0) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      { error: "An error occurred while fetching game data" },
      { status: 500 }
    );
  }
}
