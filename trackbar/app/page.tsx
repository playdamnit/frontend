"use client";

import { useQuery } from "@tanstack/react-query";
import { Gamepad2, Clock, Star } from "lucide-react";
import { igdbAdapter } from "@/adapters/igdb";
import Banner from "@/components/main/banner";
import ProductFeatures from "@/components/main/product-features";
import GameSlider from "@/components/main/game-slider";
import GameCharts from "@/components/GameCharts";
import Footer from "@/components/main/footer";
import Header from "@/components/main/header";

export default function Home() {
  const {
    data: lastReleasedGames,
    error: lastReleasedError,
    isLoading: isLoadingLastReleased,
  } = useQuery({
    queryKey: ["lastReleasedGames"],
    queryFn: () => igdbAdapter.getLatestGames(),
    retry: 1,
  });

  const {
    data: upcomingGames,
    error: upcomingError,
    isLoading: isLoadingUpcoming,
  } = useQuery({
    queryKey: ["upcomingGames"],
    queryFn: () => igdbAdapter.getUpcomingGames(),
    retry: 1,
  });

  const {
    data: popularGames,
    error: popularGamesError,
    isLoading: isLoadingPopularGames,
  } = useQuery({
    queryKey: ["popularGames"],
    queryFn: () => igdbAdapter.getPopularGames(),
    retry: 1,
  });

  if (lastReleasedError) {
    console.error("Last released games error:", lastReleasedError);
    // Handle error UI
  }

  if (upcomingError) {
    console.error("Upcoming games error:", upcomingError);
    // Handle error UI
  }

  if (popularGamesError) {
    console.error("Popular games error:", popularGamesError);
    // Handle error UI
  }

  return (
    <div className="space-y-8">
      <Header />
      <Banner />
      <ProductFeatures />

      {/* Game Charts Component */}
      <div className="max-w-[1440px] mx-auto px-4">
        <GameCharts
          title="QUOKKA Charts 🌟"
          games={popularGames || []}
          activeTab="popular"
        />
      </div>

      {/* Game Sliders */}
      <GameSlider
        games={lastReleasedGames || []}
        title="Last Released Games"
        icon={<Gamepad2 className="w-6 h-6 text-white" />}
        visibleCount={2}
      />

      <GameSlider
        games={upcomingGames || []}
        direction="left"
        title="Upcoming Games"
        icon={<Clock className="w-6 h-6 text-white" />}
        visibleCount={3}
      />
      <Footer />
    </div>
  );
}
