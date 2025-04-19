import { Database } from "@/types_db";

type Tables = Database["public"]["Tables"];

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
export type DBGame = Tables["games"]["Row"] & {
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
  created_at: number;
  first_release_date?: number;
  total_rating?: number;
  url?: string;
  cover?: {
    id: number;
    url: string;
    width: number;
    height: number;
  };
  screenshots?: GameScreenshot[];
  websites?: GameWebsite[];
  involved_companies?: string;
  keywords?: string;
  game_modes?: GameMode[];
  genres?: GameGenre[];
  platforms?: GamePlatform[];
  similar_games?: number[];
  game_types?: Array<{
    id: number;
    type: string;
  }>;
}
