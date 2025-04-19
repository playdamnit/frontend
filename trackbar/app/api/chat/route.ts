import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import axios from "axios";

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the function for searching games
const searchGamesFunction = {
  name: "search_games",
  description: "Search for games by name or description",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query for finding games",
      },
      rating: {
        type: "number",
        description: "User's rating for the game (0-10)",
      },
      status: {
        type: "string",
        enum: ["finished", "playing", "dropped", "want_to_play"],
        description: "User's play status for the game",
      },
      review: {
        type: "string",
        description: "User's review or comments about the game",
      },
      showOnlyGames: {
        type: "boolean",
        description:
          "Whether to show only main games (true) or include DLCs and other content (false)",
        default: true,
      },
    },
    required: ["query"],
  },
};

export async function POST(req: Request) {
  try {
    const { messages, showOnlyGames = true } = await req.json();

    // Call OpenAI with function calling
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful gaming assistant that helps users track games they've played. 
          When a user mentions a game they've played, use the search_games function to find the game.
          If the user mentions a rating (e.g., "I give it 8/10"), extract this as a number between 0-10 for the rating parameter.
          If the user mentions a status (e.g., "finished", "playing", "dropped", "want to play"), extract this for the status parameter.
          If the user provides any comments or review about the game, extract this for the review parameter.
          
          Be conversational and friendly. If the user doesn't mention a specific game, just chat normally.`,
        },
        ...messages,
      ],
      functions: [searchGamesFunction],
      function_call: "auto",
    });

    // Get the response content
    const responseMessage = response.choices[0].message;

    // Check if there's a function call
    if (
      responseMessage.function_call &&
      responseMessage.function_call.name === "search_games"
    ) {
      // Parse the function arguments
      const functionArgs = JSON.parse(responseMessage.function_call.arguments);
      const query = functionArgs.query;
      const userRating = functionArgs.rating;
      const userStatus = functionArgs.status;
      const userReview = functionArgs.review;
      // Get showOnlyGames from function args or use the value from request
      const userShowOnlyGames =
        functionArgs.showOnlyGames !== undefined
          ? functionArgs.showOnlyGames
          : showOnlyGames;

      // Use the actual search API endpoint to benefit from caching and game enqueueing
      console.log(
        "Calling search API with query:",
        query,
        "showOnlyGames:",
        userShowOnlyGames
      );
      const searchUrl = new URL(
        "/api/search",
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      );
      searchUrl.searchParams.append("q", query);
      searchUrl.searchParams.append("showOnlyGames", String(userShowOnlyGames));

      // Make the request to the search API
      const searchResponse = await axios.get(searchUrl.toString());
      const searchResults = searchResponse.data;

      // Always show multiple results if more than one game is found
      const shouldShowMultipleResults = searchResults.length > 1;

      let assistantResponse;

      if (shouldShowMultipleResults) {
        // Use all results without limiting to a specific number
        const topResults = searchResults;

        // Create a response with multiple game options
        assistantResponse = {
          role: "assistant",
          content: `I found ${topResults.length} games that match "${query}". Please select the specific game you meant:`,
          gameResults: topResults,
          userRating,
          userStatus,
          userReview,
        };

        console.log(
          "Sending multiple game results:",
          JSON.stringify({
            role: assistantResponse.role,
            content: assistantResponse.content,
            gameCount: topResults.length,
            showOnlyGames: userShowOnlyGames,
          })
        );
      } else if (searchResults.length > 0) {
        // Get the best match (first result)
        const bestMatch = searchResults[0];

        // Add user's rating, status, and review to the game data
        const gameData = {
          ...bestMatch,
          userRating: userRating,
          userStatus: userStatus,
          userReview: userReview,
        };

        // Create a response with the game data
        let responseContent = `I found "${bestMatch.name}" in our database.`;

        if (userRating) {
          responseContent += ` You rated it ${userRating}/10.`;
        }

        if (userStatus) {
          const statusMap: Record<string, string> = {
            finished: "finished",
            playing: "currently playing",
            dropped: "dropped",
            want_to_play: "want to play",
          };
          responseContent += ` You've marked it as ${statusMap[userStatus] || userStatus}.`;
        }

        if (userReview) {
          responseContent += ` Your thoughts: "${userReview}"`;
        }

        assistantResponse = {
          role: "assistant",
          content: responseContent,
          gameData: gameData,
        };

        // Log the response to ensure gameData is included
        console.log(
          "Sending response with game data:",
          JSON.stringify({
            role: assistantResponse.role,
            content: assistantResponse.content,
            hasGameData: !!assistantResponse.gameData,
            userRating,
            userStatus,
            userReview,
            showOnlyGames: userShowOnlyGames,
          })
        );
      } else {
        assistantResponse = {
          role: "assistant",
          content:
            "I couldn't find any games matching your description. Could you provide more details or try a different game?",
        };
      }

      return NextResponse.json({ message: assistantResponse });
    }

    // If no function call, just return the original response
    return NextResponse.json({
      message: {
        role: "assistant",
        content: responseMessage.content,
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "An error occurred during the chat" },
      { status: 500 }
    );
  }
}
