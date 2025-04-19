import { Redis } from "ioredis";

// Create Redis client with retries and error handling
const createRedisClient = () => {
  const client = new Redis({
    host: process.env.REDIS_URL?.split(":")[0],
    port: parseInt(process.env.REDIS_URL?.split(":")[1] || "6379"),
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
  });

  client.on("error", (err: Error) => {
    console.error("Redis Client Error:", err);
  });

  client.on("connect", () => {
    console.log("Redis Client Connected");
  });

  return client;
};

// Create a singleton instance
let redisClient: Redis | null = null;

export const getRedisClient = () => {
  if (!redisClient) {
    redisClient = createRedisClient();
  }
  return redisClient;
};

// Helper functions for game search caching
export const cacheKey = (query: string) => `search:${query.toLowerCase()}`;

export interface GameSearchResult {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  storyline?: string;
  first_release_date?: number | string;
  created_at?: number | string;
  total_rating?: number;
  url?: string;
  cover?: {
    id: number;
    url: string;
    width?: number;
    height?: number;
  };
  screenshots?: Array<{
    id: number;
    url: string;
    width?: number;
    height?: number;
  }>;
  genres?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  platforms?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  game_modes?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  websites?: Array<{
    id: number;
    type: string;
    url: string;
    trusted: boolean;
  }>;
  involved_companies?:
    | Array<{
        id: number;
        company: {
          id: number;
          name: string;
          slug: string;
        };
      }>
    | string;
  game_types?: Array<{
    id: number;
    type: string;
  }>;
  similar_games?: number[];
  keywords?:
    | Array<{
        id: number;
        name: string;
        slug: string;
      }>
    | string;
}

export const setGameSearchCache = async (
  query: string,
  results: GameSearchResult[],
  ttl = 24 * 60 * 60
) => {
  const client = getRedisClient();
  const key = cacheKey(query);
  await client.setex(key, ttl, JSON.stringify(results));
};

export const getGameSearchCache = async (
  query: string
): Promise<GameSearchResult[] | null> => {
  const client = getRedisClient();
  const key = cacheKey(query);
  const cached = await client.get(key);
  return cached ? JSON.parse(cached) : null;
};
