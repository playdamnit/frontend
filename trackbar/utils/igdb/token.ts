/**
 * Server-side utility for managing IGDB API tokens.
 * Handles token acquisition, caching, and automatic refreshing.
 */

import axios from "axios";
import { getRedisClient } from "@/utils/redis";

// Token TTL in seconds (default: 24 hours)
// Twitch tokens are valid for 60 days, but we refresh more frequently as a precaution
const TOKEN_TTL = 24 * 60 * 60;
const TOKEN_CACHE_KEY = "igdb:access_token";

/**
 * Get a valid IGDB access token, either from cache or by requesting a new one
 */
export async function getIGDBToken(): Promise<string> {
  const redis = getRedisClient();

  // Try to get token from cache first
  const cachedToken = await redis.get(TOKEN_CACHE_KEY);
  if (cachedToken) {
    return cachedToken;
  }

  // If no cached token, request a new one
  const token = await requestNewToken();

  // Cache the new token
  await redis.setex(TOKEN_CACHE_KEY, TOKEN_TTL, token);

  return token;
}

/**
 * Request a new access token from the Twitch API
 */
async function requestNewToken(): Promise<string> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Twitch API credentials");
  }

  try {
    const tokenUrl = "https://id.twitch.tv/oauth2/token";
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    });

    const response = await axios.post(tokenUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return `Bearer ${response.data.access_token}`;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to get IGDB access token:", errorMessage);
    throw new Error("Failed to get IGDB access token");
  }
}
