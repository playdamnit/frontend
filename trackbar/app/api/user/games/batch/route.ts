import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getServerUser } from "@/utils/supabase/server-auth";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate that body is an array
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Request body must be an array of games" },
        { status: 400 }
      );
    }

    // Validate each game in the array
    const games = body.map((game) => {
      const {
        gameId,
        status,
        rating,
        review,
        platformId,
        source = "manual",
        playtime = 0,
      } = game;

      // Validate required fields
      if (!gameId) {
        throw new Error("Game ID is required for all games");
      }

      if (!status) {
        throw new Error("Status is required for all games");
      }

      if (rating === undefined || rating === null) {
        throw new Error("Rating is required for all games");
      }

      if (!platformId) {
        throw new Error("Platform ID is required for all games");
      }

      return {
        user_id: user.id,
        game_id: gameId,
        status,
        rating,
        review,
        platform_id: platformId,
        source,
        playtime_minutes: playtime,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

    // Initialize Supabase client
    const supabase = await createClient();

    // Get existing games in the user's library to avoid duplicates
    const { data: existingGames, error: existingError } = await supabase
      .from("user_games")
      .select("game_id")
      .eq("user_id", user.id);

    if (existingError) {
      console.error("Error fetching existing games:", existingError);
      return NextResponse.json(
        { error: "Failed to check existing games" },
        { status: 500 }
      );
    }

    // Filter out games that already exist in the user's library
    const existingGameIds = existingGames.map((game) => game.game_id);
    const newGames = games.filter(
      (game) => !existingGameIds.includes(game.game_id)
    );

    if (newGames.length === 0) {
      return NextResponse.json(
        { message: "No new games to add", added: 0 },
        { status: 200 }
      );
    }

    // Insert the new games into the user's library
    const { data, error } = await supabase
      .from("user_games")
      .insert(newGames)
      .select();

    if (error) {
      console.error("Error adding games to library:", error);
      return NextResponse.json(
        { error: "Failed to add games to library" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Games added to library successfully",
        added: data.length,
        games: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);

    // Handle validation errors
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
