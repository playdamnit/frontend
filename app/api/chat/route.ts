import { z } from "zod";
import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import axios from "axios";

const searchGamesTool = tool({
  description: "Search for games by name or description",
  parameters: z.object({
    query: z.string().describe("The search query for finding games"),
    rating: z
      .number()
      .min(0)
      .max(10)
      .optional()
      .describe("User's rating for the game (0-10)"),
    status: z
      .enum(["finished", "playing", "dropped", "want_to_play"])
      .optional()
      .describe("User's play status for the game"),
    review: z
      .string()
      .optional()
      .describe("User's review or comments about the game"),
    showOnlyGames: z
      .boolean()
      .default(true)
      .describe(
        "Whether to show only main games (true) or include DLCs and other content (false)"
      ),
  }),
  execute: async ({ query, rating, status, review, showOnlyGames }) => {
    const searchUrl = new URL("/api/games/search", "http://localhost:3030");
    searchUrl.searchParams.append("q", query);
    searchUrl.searchParams.append("showOnlyGames", String(showOnlyGames));

    const searchResponse = await axios.get(searchUrl.toString());
    const searchResults = searchResponse.data;

    return {
      results: searchResults,
      userRating: rating,
      userStatus: status,
      userReview: review,
    };
  },
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: openai("gpt-4o"),
      system: `You are a helpful gaming assistant that helps users track games they've played. 
When a user mentions a game they've played, use the search_games tool to find the game.
If the user mentions a rating (e.g., "I give it 8/10"), extract this as a number between 0-10 for the rating parameter.
If the user mentions a status (e.g., "finished", "playing", "dropped", "want to play"), extract this for the status parameter.
If the user provides any comments or review about the game, extract this for the review parameter.

Be conversational and friendly. If the user doesn't mention a specific game, just chat normally.`,
      messages,
      tools: {
        search_games: searchGamesTool,
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "An error occurred during the chat" },
      { status: 500 }
    );
  }
}
