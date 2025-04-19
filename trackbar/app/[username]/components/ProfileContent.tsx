"use client";

import { useState } from "react";
import {
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useUserGames } from "@/hooks/useUserGames";
import { ProfileHeader } from "./ProfileHeader";
import { StatsCards } from "./StatsCards";
import { ProfileTabs } from "./ProfileTabs";
import { SearchAndFilter } from "./SearchAndFilter";
import { GamesList } from "./GamesList";
import { Game } from "./GameCard";
import { GameSearchResult } from "@/utils/types/game";
import AddGameModal from "@/components/AddGameModal";
import SearchModal from "@/components/search/search-modal";

// Create a client
const queryClient = new QueryClient();

// Wrapper component to provide the query client
function ProfileContentWithQueryClient(
  props: ProfileContentProps & { initialGamesData: any[] }
) {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileContentInner {...props} />
    </QueryClientProvider>
  );
}

export interface ProfileContentProps {
  isOwnProfile: boolean;
  username: string;
  fullName?: string;
  avatarUrl?: string;
}

function ProfileContentInner({
  isOwnProfile,
  username,
  fullName,
  avatarUrl,
  initialGamesData,
}: ProfileContentProps & { initialGamesData: any[] }) {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "row">("row");
  const [selectedGame, setSelectedGame] = useState<GameSearchResult | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Set up the query client
  const queryClient = useQueryClient();

  // Pre-populate the query cache with the initial data
  if (initialGamesData && initialGamesData.length > 0) {
    queryClient.setQueryData(["userGames", username], {
      games: initialGamesData,
      isOwnProfile,
    });
  }

  // Use the React Query hook
  const {
    data: userGamesData,
    isLoading,
    error,
  } = useUserGames({
    username,
    enabled: true,
  });

  // Use the data from the query or the initial data
  const games = userGamesData?.games || initialGamesData || [];

  // Transform the data for the UI
  const transformedGames = games.map((game: any) => ({
    id: parseInt(game.game_id.toString()),
    title: game.games.name,
    cover: game.games.cover?.url,
    genres: game.games.game_to_genres?.map((g: any) => g.genres.name) || [],
    platform: game.platforms?.name || "Unknown",
    status: (game.status === "want_to_play"
      ? "Want"
      : game.status === "finished"
        ? "Finished"
        : game.status === "playing"
          ? "Playing"
          : game.status === "dropped"
            ? "Dropped"
            : game.status) as "Want" | "Finished" | "Playing" | "Dropped",
    rating: game.rating || 0,
    playtime: Math.round((game.playtime_minutes || 0) / 60),
    achievements: {
      completed: game.achievements_completed || 0,
      total: game.achievements_total || 0,
    },
    source: game.source || "manual",
    dateAdded: new Date(game.created_at).toLocaleDateString(),
  }));

  const getStatusCount = (status: string) => {
    if (status === "All") return transformedGames.length;
    return transformedGames.filter((game) =>
      status === "want_to_play"
        ? game.status === "Want"
        : status === "finished"
          ? game.status === "Finished"
          : status === "playing"
            ? game.status === "Playing"
            : status === "dropped"
              ? game.status === "Dropped"
              : game.status === status
    ).length;
  };

  const tabs = [
    {
      name: "All",
      count: getStatusCount("All"),
      icon: "🎮",
      color: "quokka-cyan",
    },
    {
      name: "Finished",
      count: getStatusCount("finished"),
      icon: "✓",
      color: "green-500",
    },
    {
      name: "Playing",
      count: getStatusCount("playing"),
      icon: "▶",
      color: "blue-500",
    },
    {
      name: "Dropped",
      count: getStatusCount("dropped"),
      icon: "✕",
      color: "red-500",
    },
    {
      name: "Want",
      count: getStatusCount("want_to_play"),
      icon: "⭐",
      color: "yellow-500",
    },
  ];

  const totalPlaytime = transformedGames.reduce(
    (sum, game) => sum + (game.playtime || 0),
    0
  );

  const completionRate =
    (transformedGames.filter((game) => game.status === "Finished").length /
      transformedGames.length) *
      100 || 0;

  const achievementsCompleted = transformedGames.reduce(
    (sum, game) => sum + (game.achievements?.completed || 0),
    0
  );

  const achievementsTotal = transformedGames.reduce(
    (sum, game) => sum + (game.achievements?.total || 0),
    0
  );

  // Calculate platform distribution
  const platformDistribution = Array.from(
    new Set(transformedGames.map((g) => g.platform))
  ).map((platform) => {
    const count = transformedGames.filter(
      (g) => g.platform === platform
    ).length;
    const percentage = (count / transformedGames.length) * 100;
    return { platform, count, percentage };
  });

  // Filter games based on active tab and search term
  const filteredGames = transformedGames.filter((game) => {
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Finished" && game.status === "Finished") ||
      (activeTab === "Playing" && game.status === "Playing") ||
      (activeTab === "Dropped" && game.status === "Dropped") ||
      (activeTab === "Want" && game.status === "Want");

    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.genres.some((genre: string) =>
        genre.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesTab && matchesSearch;
  });

  // Function to handle opening the modal with the selected game
  const handleGameClick = (game: Game) => {
    if (!isOwnProfile) return; // Only allow editing on own profile

    // Convert Game to GameSearchResult format with additional properties for editing
    const gameForModal: GameSearchResult & {
      userStatus?: string;
      userRating?: number;
      userReview?: string;
      userGameId?: number;
    } = {
      id: game.id,
      name: game.title,
      slug: game.title.toLowerCase().replace(/\s+/g, "-"),
      cover: game.cover
        ? {
            id: 0,
            url: game.cover,
            width: 0,
            height: 0,
          }
        : undefined,
      genres: game.genres.map((name: string) => ({
        id: 0,
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
      })),
      platforms: [
        {
          id: 0,
          name: game.platform,
          slug: game.platform.toLowerCase().replace(/\s+/g, "-"),
        },
      ],
      created_at: Date.now(),
      // Add properties for editing
      userStatus:
        game.status.toLowerCase() === "want"
          ? "want_to_play"
          : game.status.toLowerCase(),
      userRating: game.rating,
      userReview: "", // We don't have this in the Game interface, so default to empty
      userGameId: game.id, // Use the game ID as the user game ID for now
    };

    setSelectedGame(gameForModal);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
    // Invalidate the query to refresh the data
    queryClient.invalidateQueries({ queryKey: ["userGames"] });
  };

  const handleSearchModalOpen = () => {
    setIsSearchModalOpen(true);
  };

  // Show loading state
  if (isLoading && !initialGamesData) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="text-quokka-light/40 mb-2">Loading games...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 mb-2">Error loading games</div>
            <div className="text-sm text-quokka-light/30">
              Please try again later
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <ProfileHeader
          isOwnProfile={isOwnProfile}
          username={username}
          fullName={fullName}
          avatarUrl={avatarUrl}
          onAddGameClick={handleSearchModalOpen}
        />

        <StatsCards
          totalPlaytime={totalPlaytime}
          completionRate={completionRate}
          achievementsCompleted={achievementsCompleted}
          achievementsTotal={achievementsTotal}
          totalGames={transformedGames.length}
          platformDistribution={platformDistribution}
        />

        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <ProfileTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <GamesList
          games={filteredGames}
          isOwnProfile={isOwnProfile}
          viewMode={viewMode}
          onGameClick={handleGameClick}
        />

        {/* Add Game Modal */}
        {selectedGame && (
          <AddGameModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
            game={selectedGame}
            isEditing={true}
          />
        )}

        {/* Game Search Modal */}
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          onGameSelect={(game: GameSearchResult) => {
            setSelectedGame(game);
            setIsModalOpen(true);
            setIsSearchModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}

// Export the wrapper component
export { ProfileContentWithQueryClient as ProfileContent };
