import axios, { AxiosError } from "axios";

export interface IGDBGame {
  id: number;
  name: string;
  cover?: {
    url: string;
  };
  first_release_date?: number;
  rating?: number;
  total_rating?: number;
  summary?: string;
  genres?: Array<{ name: string }>;
  platforms?: Array<{ name: string }>;
  screenshots?: Array<{ url: string }>;
  videos?: Array<{ video_id: string }>;
  involved_companies?: Array<{ company: { name: string } }>;
}

class IGDBError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "IGDBError";
  }
}

const axiosInstance = axios.create({
  baseURL: "/api/igdb", // Updated path
});

const handleIGDBError = (error: AxiosError) => {
  throw new IGDBError(
    error.message,
    error.response?.status,
    error.response?.data
  );
};

export const igdbAdapter = {
  getLatestGames: async (): Promise<IGDBGame[]> => {
    try {
      const response = await axiosInstance.post("/games", {
        // Updated path
        endpoint: "games",
        data: `fields name, cover.url, first_release_date, rating, total_rating, summary, 
               genres.name, platforms.name, screenshots.url, videos.video_id, 
               involved_companies.company.name;
               sort first_release_date desc;
               where first_release_date < ${Math.floor(Date.now() / 1000)};
               limit 30;`,
      });

      return response.data;
    } catch (error) {
      handleIGDBError(error as AxiosError);
      return []; // This line will never be reached due to handleIGDBError throwing, but satisfies TypeScript
    }
  },

  getUpcomingGames: async (): Promise<IGDBGame[]> => {
    try {
      const response = await axiosInstance.post("/games", {
        // Updated path
        endpoint: "games",
        data: `fields name, cover.url, first_release_date, summary, 
               genres.name, platforms.name, screenshots.url, videos.video_id, 
               involved_companies.company.name;
               sort first_release_date asc;
               where first_release_date > ${Math.floor(Date.now() / 1000)};
               limit 30;`,
      });

      return response.data;
    } catch (error) {
      handleIGDBError(error as AxiosError);
      return []; // This line will never be reached due to handleIGDBError throwing, but satisfies TypeScript
    }
  },

  getPopularGames: async (): Promise<IGDBGame[]> => {
    try {
      const response = await axiosInstance.post("/games", {
        endpoint: "games",
        data: `fields name, cover.url, first_release_date, rating, total_rating, summary, 
               genres.name, platforms.name, screenshots.url, videos.video_id, 
               involved_companies.company.name, slug;
               sort total_rating desc;
               where total_rating != null & cover != null;
               limit 20;`,
      });

      return response.data;
    } catch (error) {
      handleIGDBError(error as AxiosError);
      return []; // This line will never be reached due to handleIGDBError throwing, but satisfies TypeScript
    }
  },
};
