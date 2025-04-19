import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GameSearchResult } from "@/utils/types/game";

interface UseGameSearchProps {
  query: string;
  enabled?: boolean;
}

export const useGameSearch = ({
  query,
  enabled = true,
}: UseGameSearchProps) => {
  return useQuery<GameSearchResult[]>({
    queryKey: ["gameSearch", query],
    queryFn: async () => {
      if (!query) {
        return [];
      }

      const response = await axios.get("/api/search", {
        params: {
          q: query,
        },
      });

      return response.data;
    },
    enabled: enabled && !!query,
    staleTime: 1000 * 60 * 5, // Consider results stale after 5 minutes
    gcTime: 1000 * 60 * 60, // Keep unused data in cache for 1 hour
  });
};
