import { NextResponse, NextRequest } from "next/server";

interface GameData {
  name: string;
  summary?: string;
  storyline?: string;
  cover?: { url: string };
  genres?: { name: string }[];
  platforms?: { name: string }[];
  release_dates?: { human: string }[];
  age_ratings?: { rating: number; category: number }[];
  involved_companies?: {
    company: { name: string };
    developer: boolean;
    publisher: boolean;
  }[];
}

const clientId = process.env.TWITCH_CLIENT_ID;
const accessToken = process.env.TWITCH_ACCESS_TOKEN;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");

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

  const body = `
    fields id, name, slug, created_at, game_type.type, genres.name, genres.slug, platforms.name, platforms.slug, first_release_date, keywords.name,
           cover.url, cover.width, cover.height, screenshots.url, screenshots.width, screenshots.height,
           websites.type.id, websites.type.type, websites.url, websites.trusted, game_modes, total_rating, similar_games, storyline, summary,
           url, involved_companies.company.name, involved_companies.company.slug, game_modes.name,game_modes.slug;
    limit ${limit || 10};
    offset ${offset || 0};
  `;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as GameData[];

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
