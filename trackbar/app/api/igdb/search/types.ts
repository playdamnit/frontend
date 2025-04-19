export type IgdbGames = IgdbGame[];

export interface IgdbGame {
  id: number;
  cover: Cover;
  created_at: number;
  first_release_date: number;
  game_modes: GameMode[];
  genres: Genre[];
  involved_companies: InvolvedCompany[];
  name: string;
  platforms: Platform[];
  screenshots: Screenshot[];
  similar_games: number[];
  slug: string;
  total_rating: number;
  url: string;
  websites: Website[];
  game_type: GameType;
}

export interface Cover {
  id: number;
  height: number;
  url: string;
  width: number;
}

export interface GameMode {
  id: number;
  name: string;
  slug: string;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface InvolvedCompany {
  id: number;
  company: Company;
}

export interface Company {
  id: number;
  name: string;
  slug: string;
}

export interface Platform {
  id: number;
  name: string;
  slug: string;
}

export interface Screenshot {
  id: number;
  height: number;
  url: string;
  width: number;
}

export interface Website {
  id: number;
  trusted: boolean;
  url: string;
  type: Type;
}

export interface Type {
  id: number;
  type: string;
}

export interface GameType {
  id: number;
  type: string;
}
