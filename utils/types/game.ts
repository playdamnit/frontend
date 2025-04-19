export interface GameGenre {
  id: number;
  name: string;
  slug: string;
}

export interface GamePlatform {
  id: number;
  name: string;
  slug: string;
}

export interface GameScreenshot {
  id: number;
  url: string;
  width: number;
  height: number;
}

export interface GameWebsite {
  id: number;
  type: {
    id: number | null;
    type: string;
  };
  url: string;
  trusted: boolean | null;
}

export interface GameCompany {
  company: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface GameMode {
  id: number;
  name: string;
  slug: string;
}

export interface GameKeyword {
  id: number;
  name: string;
}

// Extended database type for games table with its relationships
export type DBGame = {
  id: number;
  name: string;
  slug: string;
  summary: string | null;
  storyline: string | null;
  first_release_date: string | null;
  created_at: string | null;
  total_rating: number | null;
  url: string | null;
  covers?: {
    id: number;
    url: string;
    width: number | null;
    height: number | null;
  };
  involved_companies: string | null;
  keywords: string | null;
  similar_games: number[] | null;
  game_type_id: number | null;
  updated_at: string | null;
  game_to_genres?: Array<{ genres: GameGenre }>;
  game_to_platforms?: Array<{ platforms: GamePlatform }>;
  game_to_modes?: Array<{ game_modes: GameMode }>;
  game_to_types?: Array<{ types: { id: number; type: string } }>;
  screenshots?: GameScreenshot[];
  websites?: GameWebsite[];
  involved_companies_rel?: Array<{
    company: {
      id: number;
      name: string;
      slug: string;
    };
  }>;
  keywords_rel?: Array<{ keywords: GameKeyword }>;
  type_id: number | null;
  type: string | null;
};

export interface GameSearchResult {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  storyline?: string;
  firstReleaseDate?: number;
  createdAt: number;
  totalRating?: number;
  involvedCompanies?: string;
  keywords?: string;
  updatedAt: number;
  isPopular: boolean;
  cover?: {
    id: number;
    url: string;
    width: number;
    height: number;
  };
  screenshots?: Array<{
    id: number;
    url: string;
    width: number;
    height: number;
  }>;
  websites?: Array<{
    id: number;
    gameId: number;
    url: string;
    trusted: boolean;
    typeId: number | null;
  }>;
  platforms?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  genres?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  types?: Array<{
    id: number;
    type: string;
  }>;
  similarGames?: Array<{
    id: number;
  }>;
  userGameData?: {
    status?: string;
    rating?: string;
    review?: string;
    platformId?: number;
    addedAt?: string;
    source?: string;
  };
  // For backward compatibility with existing code
  userRating?: number;
  userStatus?: string;
  userReview?: string;
}

export interface SearchResponse {
  results: GameSearchResult[];
  meta: {
    total: number;
    source: string;
    freshness: string;
    query_time_ms: number;
  };
}
