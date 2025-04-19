export interface Game {
  id: number;
  name: string;
  cover?: {
    id: number;
    url: string;
  };
  first_release_date?: number;
  involved_companies?: Array<{
    id: number;
    company: {
      id: number;
      name: string;
    };
  }>;
  platforms?: Array<{
    id: number;
    name: string;
  }>;
  genres?: Array<{
    id: number;
    name: string;
  }>;
  rating?: number;
  lists?: number;
  reviews?: number;
  summary?: string;
  videos?: Array<{
    id: number;
    video_id: string;
  }>;
  screenshots?: Array<{
    id: number;
    url: string;
  }>;
}
