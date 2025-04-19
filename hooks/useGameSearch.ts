import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { SearchResponse } from "@/utils/types/game";
import { getConfig } from "@/config";
interface UseGameSearchProps {
  query: string;
  enabled?: boolean;
}

const { backendUrl } = getConfig();

export const useGameSearch = ({
  query,
  enabled = true,
}: UseGameSearchProps): UseQueryResult<SearchResponse> => {
  return useQuery<SearchResponse>({
    queryKey: ["gameSearch", query],
    queryFn: async () => {
      if (!query) {
        return {
          results: [],
          meta: { total: 0, source: "", freshness: "", query_time_ms: 0 },
        };
      }

      const response = await axios.get<SearchResponse>(
        `${backendUrl}/games/search`,
        {
          params: {
            q: query,
          },
        }
      );

      return response.data;
    },
    enabled: enabled && !!query,
    staleTime: 1000 * 60 * 5, // Consider results stale after 5 minutes
    gcTime: 1000 * 60 * 60, // Keep unused data in cache for 1 hour
  });
};
