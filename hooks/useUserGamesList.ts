import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/authClient";
import { getConfig } from "@/config";

interface UserGamesQueryParams {
  username: string;
  status?:
    | "finished"
    | "playing"
    | "dropped"
    | "online"
    | "want_to_play"
    | "backlog";
  platformId?: number;
  sort?: string;
  order?: string;
  enabled?: boolean;
}

const { backendUrl } = getConfig();

async function getUserGames(params: UserGamesQueryParams) {
  const {
    username,
    status,
    platformId,
    sort = "created_at",
    order = "desc",
  } = params;

  const queryParams = new URLSearchParams();
  if (status) queryParams.append("status", status);
  if (platformId) queryParams.append("platform", platformId.toString());
  if (sort) queryParams.append("sort", sort);
  if (order) queryParams.append("order", order);

  const apiUrl = `${backendUrl}/user/${username}/games${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  try {
    const response = await axios.get(apiUrl, {
      withCredentials: true,
    });
    const games = response.data;
    console.log(`Found ${games.length} games for user ${username}`);

    return {
      games,
    };
  } catch (error) {
    console.error("Error fetching user games:", error);
    throw new Error("Failed to fetch games");
  }
}

export function useUserGamesList({
  username,
  status,
  platformId,
  sort = "created_at",
  order = "desc",
  enabled = true,
}: UserGamesQueryParams) {
  return useQuery({
    queryKey: ["userGamesList", username, status, platformId, sort, order],
    queryFn: () => getUserGames({ username, status, platformId, sort, order }),
    enabled: enabled && !!username,
    staleTime: 1000 * 60 * 2, // Results stale after 2 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
  });
}
