"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Game } from "@/types/game";

interface GameContextType {
  games: Game[];
  addGame: (game: Game) => void;
  updateGame: (id: number, updates: Partial<Game>) => void;
  deleteGame: (id: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>([
    {
      id: 1,
      title: "The Witcher 3",
      status: "Completed",
      rating: 10,
      platform: "PC",
      playtime: 100,
    },
    {
      id: 2,
      title: "Cyberpunk 2077",
      status: "Playing",
      rating: 8,
      platform: "PS5",
      playtime: 30,
    },
    {
      id: 3,
      title: "Elden Ring",
      status: "Backlog",
      rating: null,
      platform: "PC",
      playtime: 0,
    },
  ]);

  const addGame = (game: Game) => {
    setGames([...games, { ...game, id: games.length + 1 }]);
  };

  const updateGame = (id: number, updates: Partial<Game>) => {
    setGames(
      games.map((game) => (game.id === id ? { ...game, ...updates } : game))
    );
  };

  const deleteGame = (id: number) => {
    setGames(games.filter((game) => game.id !== id));
  };

  return (
    <GameContext.Provider value={{ games, addGame, updateGame, deleteGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
}
