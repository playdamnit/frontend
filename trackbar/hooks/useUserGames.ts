import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  GameSearchResult,
  GamePlatform,
  GameGenre,
  GameMode,
  GameScreenshot,
  GameWebsite,
} from "@/utils/types/game";

// Types
// interface UserGame {
//   id: string;
//   user_id: string;
//   game_id: number;
//   status:
//     | "finished"
//     | "playing"
//     | "dropped"
//     | "want_to_play"
//     | "online"
//     | "backlog";
//   rating: number;
//   review: string | null;
//   platform_id: number;
//   source: "manual" | "steam" | "gog";
//   playtime_minutes: number;
//   achievements_total: number;
//   achievements_completed: number;
//   created_at: string;
//   updated_at: string;
//   games: GameSearchResult;
//   platforms: GamePlatform;
// }

// interface UseUserGamesProps {
//   username?: string;
//   status?: string;
//   platform?: string;
//   sort?: string;
//   order?: "asc" | "desc";
//   enabled?: boolean;
// }

// interface AddGamePayload {
//   gameId: number;
//   status: string;
//   rating: number;
//   review?: string;
//   platformId: number;
//   source?: "manual" | "steam" | "gog";
//   playtime?: number;
//   gameDetails?: {
//     name: string;
//     slug: string;
//     summary?: string;
//     storyline?: string;
//     first_release_date?: number;
//     total_rating?: number;
//     cover?: {
//       id: number;
//       url: string;
//       width?: number;
//       height?: number;
//     };
//     platforms?: GamePlatform[];
//     genres?: GameGenre[];
//     game_modes?: GameMode[];
//     game_types?: Array<{ id: number; type: string }>;
//     screenshots?: GameScreenshot[];
//     websites?: GameWebsite[];
//   };
// }

// interface UpdateGamePayload {
//   status: string;
//   rating: number;
//   review?: string;
// }

interface UserGamesResponse {
  games: UserGame[];
  isOwnProfile: boolean;
}

// Hook for fetching user games
export const useUserGames = ({
  username,
  status,
  platform,
  sort = "created_at",
  order = "desc",
  enabled = true,
}: UseUserGamesProps = {}) => {
  return useQuery<UserGamesResponse>({
    queryKey: ["userGames", username, status, platform, sort, order],
    queryFn: async () => {
      const params: Record<string, string> = {};

      if (username) params.username = username;
      if (status) params.status = status;
      if (platform) params.platform = platform;
      if (sort) params.sort = sort;
      if (order) params.order = order;

      const response = await axios.get("/api/user/games", { params });
      return response.data;
    },
    enabled,
    staleTime: 1000 * 60 * 2, // Consider results stale after 2 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
  });
};

// Hook for adding a game to user collection
export const useAddUserGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gameData: AddGamePayload) => {
      const response = await axios.post("/api/user/games", gameData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the userGames query to trigger a refresh
      queryClient.invalidateQueries({ queryKey: ["userGames"] });
    },
  });
};

// Hook for updating a game in user collection
export const useUpdateUserGame = (gameId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gameData: UpdateGamePayload) => {
      const response = await axios.patch(`/api/user/games/${gameId}`, gameData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the userGames query to trigger a refresh
      queryClient.invalidateQueries({ queryKey: ["userGames"] });
    },
  });
};

// Hook for deleting a game from user collection
export const useDeleteUserGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gameId: string) => {
      const response = await axios.delete(`/api/user/games/${gameId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the userGames query to trigger a refresh
      queryClient.invalidateQueries({ queryKey: ["userGames"] });
    },
  });
};
