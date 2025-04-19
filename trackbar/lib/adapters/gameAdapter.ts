import { Game } from "@/types/game";
import { notFound } from "next/navigation";

export async function getGameById(id: string): Promise<Game> {
  const response = await fetch(`http://localhost:3000/api/game?id=${id}`);

  if (!response.ok) {
    notFound();
  }

  const game = await response.json();

  if (!game) {
    notFound();
  }

  return {
    ...game,
    rating: game.rating || 0,
    lists: game.lists || 0,
    reviews: game.reviews || 0,
    involved_companies: game.involved_companies || [],
    platforms: game.platforms || [],
    genres: game.genres || [],
    videos: game.videos || [],
    screenshots: game.screenshots || [],
  };
}
