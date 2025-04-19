import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getServerUser } from "@/utils/supabase/server-auth";
import { getUserGameById } from "@/app/helpers/getUserGameById";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = parseInt(params.id, 10);
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");

    const result = await getUserGameById({
      gameId,
      username,
    });

    if (!result.game) {
      return NextResponse.json(
        {
          ...result,
          message: "Game not found in user's library",
        },
        { status: 404 }
      );
    }

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the user_games entry ID from the URL params
    const entryId = params.id;
    if (!entryId) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      );
    }

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
    const { status, rating, review, platformId, source, playtime } = body;

    // Validate required fields
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

    // Initialize Supabase client
    const supabase = await createClient();

    // Check if the game exists and belongs to the user
    const { data: existingGame, error: checkError } = await supabase
      .from("user_games")
      .select("id")
      .eq("id", entryId)
      .eq("user_id", user.id)
      .single();

    if (checkError || !existingGame) {
      return NextResponse.json(
        { error: "Game not found or you don't have permission to update it" },
        { status: 404 }
      );
    }

    // Convert rating from 0-100 scale to 0-10 scale if needed
    const normalizedRating =
      rating > 10
        ? parseFloat((rating / 10).toFixed(1)) // Convert to 0-10 scale with one decimal place
        : parseFloat(rating.toFixed(1)); // Keep one decimal place

    // Prepare update data
    const updateData: Record<string, unknown> = {
      status,
      rating: normalizedRating,
      review,
      updated_at: new Date().toISOString(),
    };

    if (platformId !== undefined) updateData.platform_id = platformId;
    if (source !== undefined) updateData.source = source;
    if (playtime !== undefined) updateData.playtime_minutes = playtime;

    // Update the game
    const { data, error } = await supabase
      .from("user_games")
      .update(updateData)
      .eq("id", entryId)
      .eq("user_id", user.id) // Ensure the user can only update their own games
      .select()
      .single();

    if (error) {
      console.error("Error updating game:", error);
      return NextResponse.json(
        { error: "Failed to update game", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Game updated successfully",
      game: data,
    });
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the user_games entry ID from the URL params
    const entryId = params.id;
    if (!entryId) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      );
    }

    // Get the authenticated user
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Initialize Supabase client
    const supabase = await createClient();

    // Check if the game exists and belongs to the user
    const { data: existingGame, error: checkError } = await supabase
      .from("user_games")
      .select("id")
      .eq("id", entryId)
      .eq("user_id", user.id)
      .single();

    if (checkError || !existingGame) {
      return NextResponse.json(
        { error: "Game not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    // Delete the game
    const { error } = await supabase
      .from("user_games")
      .delete()
      .eq("id", entryId)
      .eq("user_id", user.id); // Ensure the user can only delete their own games

    if (error) {
      console.error("Error deleting game:", error);
      return NextResponse.json(
        { error: "Failed to delete game", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Game deleted successfully",
    });
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
