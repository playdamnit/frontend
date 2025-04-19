import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";
import { getServerUser } from "@/utils/supabase/server-auth";
import { getUserGames } from "@/app/helpers/getUserGames";
import { postUserGame } from "@/app/helpers/postUserGame";

import { Database } from "@/types_db";

const GameStatusEnum = z.enum([
  "finished",
  "playing",
  "dropped",
  "online",
  "want_to_play",
  "backlog",
]);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get(
      "status"
    ) as Database["public"]["Enums"]["game_status"];
    const platformId = searchParams.get("platform");
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";
    const username = searchParams.get("username");

    const validatedStatus = GameStatusEnum.safeParse(status);

    if (!username) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 }
      );
    }

    if (status && !validatedStatus.success) {
      return NextResponse.json(
        { error: "Invalid status parameter" },
        { status: 400 }
      );
    }

    const result = await getUserGames({
      username,
      status,
      platformId: platformId ? parseInt(platformId, 10) : undefined,
      sort,
      order,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const {
      gameId,
      status,
      rating,
      review,
      platformId,
      source = "manual",
      playtime = 0,
      gameDetails = null,
    } = body;

    // Validate required fields
    if (!gameId) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    if (rating === undefined || rating === null) {
      return NextResponse.json(
        { error: "Rating is required" },
        { status: 400 }
      );
    }

    if (!platformId) {
      return NextResponse.json(
        { error: "Platform ID is required" },
        { status: 400 }
      );
    }

    // Use the helper function to add the game to the user's library
    const result = await postUserGame({
      gameId,
      status: status as Database["public"]["Enums"]["game_status"],
      rating,
      review,
      platformId,
      source: source as Database["public"]["Enums"]["game_source"],
      playtime,
      gameDetails,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === "Authentication required") {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }

      if (error.message === "Game already exists in your library") {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
    }

    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
